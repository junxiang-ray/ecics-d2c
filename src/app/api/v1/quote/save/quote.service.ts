import { PrismaClient } from '@prisma/client';
import { saveQuoteDTO } from './quote.dto';
import logger from '@/app/api/libs/logger';
import { generateQuoteEmail } from '@/app/api/libs/mailer/templates';
import { sendMail } from '@/app/api/libs/mailer';

const prisma = new PrismaClient();

export async function saveQuote(data: saveQuoteDTO) {
  const existingQuote = await prisma.quote.findFirst({
    where: {
      key: data.key,
    },
  });

  if (existingQuote) {
    logger.info(
      `Quote with ID ${existingQuote.id} found. Updating with new data: ${JSON.stringify(data)}`,
    );
    const updatedQuote = await prisma.quote.update({
      where: { id: existingQuote.id },
      data: {
        quote_no: data.quoteNo,
        policy_id: data.policyId,
        phone: data.phone,
        email: data.email,
        name: data.name,
        data: data.data,
        partner_code: data.partnerCode,
        is_finalized: data.isFinalized ?? false,
        is_paid: data.isPaid ?? false,
        expiration_date: data.expirationDate
          ? new Date(data.expirationDate)
          : undefined,
        key: data.key,
        personal_info_id: data.personalInfoId,
        company_id: data.companyId,
        payment_result_id: data.paymentResultId,
        country_nationality_id: data.countryNationalityId,
        product_type_id: data.productTypeId,
        promo_code_id: data.promoCodeId,
      },
      include: {
        promo_code: {
          select: {
            code: true,
            discount: true,
            startTime: true,
            endTime: true,
            description: true,
            products: true,
            isPublic: true,
            isShowCountdown: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        personal_info: {
          select: {
            id: true,
            phone: true,
            email: true,
            name: true,
            gender: true,
            nric: true,
            maritalStatus: true,
            dateOfBirth: true,
            address: true,
            vehicleMake: true,
            vehicleModel: true,
            yearOfRegistration: true,
            vehicles: true,
          },
        },
        country_nationality: {
          select: {
            id: true,
            name: true,
          },
        },
        product_type: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      message: 'Quote updated successfully.',
      data: updatedQuote,
    };
  }

  // If the quote does not exist, create a new one
  logger.info(
    `Quote not found. Creating a new quote with data: ${JSON.stringify(data)}`,
  );
  const newQuote = await prisma.quote.create({
    data: {
      quote_id: data.quoteId,
      quote_no: data.quoteNo,
      policy_id: data.policyId,
      product_id: data.productId,
      proposal_id: data.proposalId,
      phone: data.phone,
      email: data.email,
      name: data.name,
      data: data.data,
      partner_code: data.partnerCode,
      is_finalized: data.isFinalized ?? false,
      is_paid: data.isPaid ?? false,
      expiration_date: data.expirationDate
        ? new Date(data.expirationDate)
        : undefined,
      key: data.key,
      personal_info_id: data.personalInfoId,
      company_id: data.companyId,
      payment_result_id: data.paymentResultId,
      country_nationality_id: data.countryNationalityId,
      product_type_id: data.productTypeId,
      promo_code_id: data.promoCodeId,
    },
  });

  const retrieveQuoteHTML = generateQuoteEmail({
    quote_key: newQuote.key ?? '',
    name: newQuote.name ?? '',
  });
  sendMail({
    to: newQuote.email ?? '',
    subject: `ECICS Limited | Your Car Insurance Quotation <${newQuote.quote_no}>`,
    html: retrieveQuoteHTML,
  });

  return {
    message: 'Quote created successfully.',
    data: newQuote,
  };
}
