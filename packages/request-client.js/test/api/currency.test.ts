// tslint:disable:no-magic-numbers
import { RequestLogicTypes } from '@requestnetwork/types';
import { assert } from 'chai';
import 'mocha';
import { getDecimalsForCurrency, stringToCurrency } from '../../src/api/currency';

describe('api/currency', () => {
  describe('getDecimalsForCurrency', () => {
    it('returns the correct number of decimals', async () => {
      assert.equal(
        await getDecimalsForCurrency({
          type: RequestLogicTypes.CURRENCY.ETH,
          value: 'ETH',
        }),
        18,
      );
    });

    it('throws for invalid currencies', async () => {
      assert.isRejected(
        getDecimalsForCurrency({
          type: 'BANANA' as RequestLogicTypes.CURRENCY,
          value: 'SPLIT',
        } as RequestLogicTypes.ICurrency),
        'Currency BANANA not implemented',
      );
    });

    it('returns the correct number of decimals for a supported ERC20', async () => {
      assert.equal(
        await getDecimalsForCurrency({
          network: 'mainnet',
          type: RequestLogicTypes.CURRENCY.ERC20,
          value: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359', // DAI
        }),
        18,
      );
    });

    it('returns the correct number of decimals for a non-supported ERC20', async () => {
      assert.equal(
        await getDecimalsForCurrency({
          network: 'private',
          type: RequestLogicTypes.CURRENCY.ERC20,
          value: '0x9FBDa871d559710256a2502A2517b794B482Db40', // local ERC20 contract
        }),
        18,
      );
    });
  });

  describe('stringToCurrency', () => {
    it('return the correct currency for ETH string', () => {
      assert.deepEqual(stringToCurrency('ETH'), {
        type: RequestLogicTypes.CURRENCY.ETH,
        value: 'ETH',
      });
    });

    it('return the correct currency for BTC string', () => {
      assert.deepEqual(stringToCurrency('BTC'), {
        type: RequestLogicTypes.CURRENCY.BTC,
        value: 'BTC',
      });
    });

    it('return the correct currency for DAI string', () => {
      assert.deepEqual(stringToCurrency('DAI'), {
        network: 'mainnet',
        type: RequestLogicTypes.CURRENCY.ERC20,
        value: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      });
    });

    it('return the correct currency for REQ string', () => {
      assert.deepEqual(stringToCurrency('REQ'), {
        network: 'mainnet',
        type: RequestLogicTypes.CURRENCY.ERC20,
        value: '0x8f8221aFbB33998d8584A2B05749bA73c37a938a',
      });
    });

    it('return the correct currency for CTBK-rinkeby string', () => {
      assert.deepEqual(stringToCurrency('CTBK-rinkeby'), {
        network: 'rinkeby',
        type: RequestLogicTypes.CURRENCY.ERC20,
        value: '0x995d6a8c21f24be1dd04e105dd0d83758343e258',
      });
    });

    it('return the correct currency for USD and EUR strings', () => {
      assert.deepEqual(stringToCurrency('USD'), {
        type: RequestLogicTypes.CURRENCY.ISO4217,
        value: 'USD',
      });

      assert.deepEqual(stringToCurrency('EUR'), {
        type: RequestLogicTypes.CURRENCY.ISO4217,
        value: 'EUR',
      });
    });

    it('throws for DAI not on mainnet', () => {
      assert.throws(() => stringToCurrency('DAI-rinkeby'));
    });

    it('throws for an unsupported currency', () => {
      assert.throws(() => stringToCurrency('XXXXXXX'));
    });
  });
});