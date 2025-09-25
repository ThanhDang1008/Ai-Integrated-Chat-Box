import { rateLimit } from 'express-rate-limit'

const limiterSendMail = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5, // limit each IP to 1 requests per windowMs
    message: {
        code: "429",
        message: "Too many requests, please try again later!",
        status: "TOO_MANY_REQUESTS"
    }
});

export {
    limiterSendMail
}