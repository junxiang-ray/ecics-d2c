import { paymentDTO } from './payment.dto';
import { handleApiCallToISP } from '../../configs/api.config';
import { CAR_INSURANCE } from '../../constants/car.insurance';
import { HOMECONTENT_INSURANCE } from '../../constants/homecontent.insurance';
import { MOTORCYCLE_INSURANCE } from '../../constants/motorcycle.insurance';
import { ErrFromISPRes, ErrNotFound } from '../../core/error.response';
import logger from '../../libs/logger';
import { prisma } from '../../libs/prisma';

export async function handlePayment(data: paymentDTO) {
  try {
    const { key } = data;

    const quoteInfo = await prisma.quote.findFirst({
      where: {
        key: key,
      },
      select: {
        quote_id: true,
        payment_id: true,
        email: true,
        id: true,
      },
    });

    if (!quoteInfo) {
      return ErrNotFound('Quote not found');
    }
    let redirectUrl = '';
    let returnBaseUrl = '';
    if (process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_WEBSITE) {
      redirectUrl = `${process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_WEBSITE}?key=${key}`;
    } else {
      redirectUrl = `https://${process.env.VERCEL_BRANCH_URL}/motor/summary?key=${key}`;
    }
    if (process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL) {
      returnBaseUrl = process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL;
    } else {
      returnBaseUrl = `https://${process.env.VERCEL_BRANCH_URL}/api/v1/payment-result`;
    }

    const payloadData = {
      payment_id: quoteInfo.payment_id,
      email: quoteInfo.email,
      redirect_url: redirectUrl,
      return_baseurl: returnBaseUrl,
    };

    const resPayment = await handleApiCallToISP(
      `/${CAR_INSURANCE.PREFIX_ENDPOINT}/payment`,
      payloadData,
    );
    // logger.info(`Response from payment: ${JSON.stringify(resPayment)}`);

    if (resPayment.status !== 0) {
      logger.error(
        `Error from ISP while handling payment: ${JSON.stringify(resPayment)}`,
      );
      return ErrFromISPRes(resPayment);
    }

    return resPayment.data;
  } catch (error) {
    logger.error(`Error while handling payment: ${error}`);
    throw new Error('Error while handling payment');
  }
}

export async function handleMotorcyclePayment(data: paymentDTO) {
  try {
    const { key } = data;

    const quoteInfo = await prisma.quote.findFirst({
      where: {
        key: key,
      },
      select: {
        quote_id: true,
        proposal_id: true,
        payment_id: true,
        email: true,
        id: true,
      },
    });

    if (!quoteInfo) {
      return ErrNotFound('Quote not found');
    }

    const payloadData = {
      quoteId: quoteInfo.quote_id,
      proposalId: quoteInfo.proposal_id,
      paymentId: quoteInfo.payment_id,
    };
    logger.info(`Calling payment with payload: ${JSON.stringify(payloadData)}`);

    const resPayment = await handleApiCallToISP(
      `/${MOTORCYCLE_INSURANCE.PREFIX_ENDPOINT}/payment`,
      payloadData,
    );
    // logger.info(`Response from payment: ${JSON.stringify(resPayment)}`);

    if (resPayment.status !== 0) {
      logger.error(
        `Error from ISP while handling payment: ${JSON.stringify(resPayment)}`,
      );
      return ErrFromISPRes(resPayment);
    }

    return resPayment.data;
  } catch (error) {
    logger.error(`Error while handling payment: ${error}`);
    throw new Error('Error while handling payment');
  }
}

export async function handleHomeContentPayment(data: paymentDTO) {
  try {
    const { key } = data;

    const quoteInfo = await prisma.quote.findFirst({
      where: {
        key: key,
      },
      select: {
        quote_id: true,
        proposal_id: true,
        payment_id: true,
        email: true,
        id: true,
      },
    });

    if (!quoteInfo) {
      return ErrNotFound('Quote not found');
    }
    let redirectUrl = '';
    let returnBaseUrl = '';
    if (process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_FOR_HOMECONTENT_WEBSITE) {
      redirectUrl = `${process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_FOR_HOMECONTENT_WEBSITE}?key=${key}`;
    } else {
      redirectUrl = `https://${process.env.VERCEL_BRANCH_URL}/home-contents/quote-detail?key=${key}`;
    }
    if (process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL) {
      returnBaseUrl = process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL;
    } else {
      returnBaseUrl = `https://${process.env.VERCEL_BRANCH_URL}/api/v1/payment-result`;
    }
    logger.info(`redirectURL check in the v1/payment: ${redirectUrl}`);
    logger.info(`returnBase url check in the v1/payment : ${returnBaseUrl}`);
    const payloadData = {
      quoteId: quoteInfo.quote_id,
      proposalId: quoteInfo.proposal_id,
      paymentId: quoteInfo.payment_id,
      redirect_url: redirectUrl,
      return_baseurl: returnBaseUrl,
    };
    logger.info(`Calling payment with payload: ${JSON.stringify(payloadData)}`);

    const resPayment = await handleApiCallToISP(
      `${HOMECONTENT_INSURANCE.PREFIX_ENDPOINT}/payment`,
      payloadData,
    );
    logger.info(`Response from payment hi: ${JSON.stringify(resPayment)}`);

    if (resPayment.status !== 0) {
      logger.error(
        `Error from ISP while handling payment: ${JSON.stringify(resPayment)}`,
      );
      return ErrFromISPRes(resPayment);
    }

    return resPayment.data;
  } catch (error) {
    logger.error(`Error while handling payment: ${error}`);
    throw new Error('Error while handling payment');
  }
}
