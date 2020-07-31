import Quote from '../models/Quote';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import sendEmail from '../utils/sendEmail';

// @desc Request Quote
// @route POST /api/v1/quote
// Public
export const getQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.create(req.body);

  // Quote message
  const message = `Hi ${req.body.name}, your requested quote is .......                                                            
  [${req.body.message}]
  
  We have recieved your quote and will get back to you ASAP.
   
  Thank you.`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Quote',
      message,
    });

    res.status(200).json({
     
      data:{
        success: true,
        quote,
      } 
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});
