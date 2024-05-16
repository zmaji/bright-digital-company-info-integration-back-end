import logger from '../utils/Logger';
import SparkPost from 'sparkpost';
import dotenv from 'dotenv';

dotenv.config();

const SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY;
const sparkpostClient = new SparkPost(SPARKPOST_API_KEY, { origin: "https://api.eu.sparkpost.com:443" });

const emailTemplate = (firstName: string, lastName:string, activationToken: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company.info Integration</title>
    <style>
        .v-template {
            background-color: #f5f7fa;
            width: 100%;
        }

        .v-template__container {
            width: 100%;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .v-template__squeeze {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            background-color: #ffffff;
        }

        .v-template__header-container {
            background-color: #212121;
            height: 65px;
            padding: 8px;
            width: 100%;
            box-sizing: border-box;
        }

        .v-template__header-logo {
            vertical-align: middle;
            display: table-cell;
            height: 48px;
        }

        .v-template__header-title {
            color: #fff;
            text-align: right;
            display: table-cell;
            vertical-align: middle;
            font-size: 16px;
            font-weight: 500;
        }

        .v-template__seperator {
            height: 8px;
            background-image: linear-gradient(to right, #ff7e5f, #feb47b);
        }

        .v-template__image-container {
            height: 260px;
            background-image: url('https://companyinfo.brightdigital.dev/static/media/Install-script-background.b1b177fd4f5cdf2f8666.png');
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            transform: scaleX(-1);
        }

        .v-template__content-container {
            padding: 25px 50px 50px 50px;
        }

        .v-template__content-paragraph {
            color: #212121;
            line-height: 1.5rem;
            font-size: 16px;
            font-weight: 300;
        }

        .v-template__content-code {
            color: #212121;
            text-align: center;
            margin-top: 20px;
            font-weight: 500;
            font-size: 22px;
        }

        .v-template__content-title {
            font-size: 38px;
            font-weight: 300;
        }

        .v-template__footer {
            background-color: #212121;
            padding: 20px;
            text-align: center;
        }

        .v-template__footer-logo {
            height: 68px;
            margin-bottom: 25px;
            margin-top: 20px;
        }

        .v-template__footer-paragraph {
            color: #fff;
            line-height: 1.5rem;
            font-size: 16px;
            font-weight: 300;
        }

        .v-template__socials-container {
            margin-top: 25px;
            text-align: center;
        }

        .v-template__social-ref {
            margin-right: 15px;
        }

        .v-template__socials-item {
            height: 25px;
        }

        .v-template__seperator-line {
            width: 100%;
            height: 0.5px;
            background-color: #fff;
            margin-top: 25px;
            margin-bottom: 25px;
        }

        .v-template__links-container {
            margin-bottom: 25px;
        }

        .v-template__links-item {
            color: #fff;
            font-size: 14px;
            font-weight: 300;
            text-decoration: underline;
            margin-right: 5px;
        }

        .v-template__word-seperator {
            color: #fff;
            font-size: 14px;
            font-weight: 300;
            margin-right: 5px;
        }

        .v-template__footer-address {
            color: #fff;
            font-size: 14px;
            font-weight: 300;
            margin-bottom: 25px;
        }
    </style>
</head>
<body class="v-template">
    <div class="v-template__container">
        <table class="v-template__squeeze" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <table class="v-template__header-container">
                        <tr>
                            <td><img class="v-template__header-logo" src="https://cdn2.hubspot.net/hub/248909/hubfs/Bright_logo/Bright-logo-wit.png?width=240&upscale=true&name=Bright-logo-wit.png" alt="Bright Digital Logo" /></td>
                            <td class="v-template__header-title">Company.info Integration</td>
                        </tr>
                    </table>

                    <div class="v-template__seperator"></div>

                    <div class="v-template__image-container"></div>

                    <div class="v-template__content-container">
                        <h1 class="v-template__content-title">Hi ${firstName} ${lastName},</h1>

                        <div class="v-template__content-paragraph">
                            Thank you for registering. Please enter the following code to activate your account:
                            <div class="v-template__content-code">${activationToken}</div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="v-template__footer">
                    <img class="v-template__footer-logo" src="https://cdn2.hubspot.net/hub/248909/hubfs/Bright_logo/Bright-logo-wit.png?width=240&upscale=true&name=Bright-logo-wit.png" alt="Bright Digital Logo" />

                    <div class="v-template__footer-paragraph">The full-service partner for companies that want to grow smarter with HubSpot</div>

                    <div class="v-template__socials-container">
                        <a class="v-template__social-ref" href="https://www.linkedin.com/company/2632117" target="_blank" rel="noopener noreferrer">
                            <img class="v-template__socials-item" src="https://www.brightdigital.com/hs/hsstatic/TemplateAssets/static-1.262/img/hs_default_template_images/modules/Follow+Me+-+Email/linkedin_original_white.png" alt="LinkedIn logo" />
                        </a>

                        <a class="v-template__social-ref" href="https://twitter.com/BureauBright" target="_blank" rel="noopener noreferrer">
                            <img class="v-template__socials-item" src="https://www.brightdigital.com/hs/hsstatic/TemplateAssets/static-1.262/img/hs_default_template_images/modules/Follow+Me+-+Email/twitter_original_white.png" alt="X logo" />
                        </a>

                        <a class="v-template__social-ref" href="https://www.instagram.com/brightwaytogrow/" target="_blank" rel="noopener noreferrer">
                            <img class="v-template__socials-item" src="https://www.brightdigital.com/hs/hsstatic/TemplateAssets/static-1.262/img/hs_default_template_images/modules/Follow+Me+-+Email/instagram_original_white.png" alt="Instagram logo" />
                        </a>

                        <a class="v-template__social-ref" href="https://www.facebook.com/Brightwaytogrow/" target="_blank" rel="noopener noreferrer">
                            <img class="v-template__socials-item" src="https://www.brightdigital.com/hs/hsstatic/TemplateAssets/static-1.262/img/hs_default_template_images/modules/Follow+Me+-+Email/facebook_original_white.png" alt="Facebook logo" />
                        </a>
                    </div>

                    <div class="v-template__seperator-line"></div>

                    <div class="v-template__links-container">
                        <a class="v-template__links-item" href="https://www.brightdigital.com/nl/" target="_blank" rel="noopener noreferrer">Brightdigital.com</a>

                        <span class="v-template__word-seperator">|</span>

                        <a class="v-template__links-item" href="https://www.brightdigital.com/nl/privacyverklaring" target="_blank" rel="noopener noreferrer">Privacyverklaring</a>

                        <span class="v-template__word-seperator">|</span>

                        <a class="v-template__links-item" href="https://www.brightdigital.com/hubfs/Bright%20Digital%20website/2022%20_%20Algemene%20voorwaarden%20_%20Bright%20Digital%20B.V..pdf" target="_blank" rel="noopener noreferrer">Algemene voorwaarden</a>
                    </div>

                    <div class="v-template__footer-address">Bright Digital B.V., Vosselmanstraat 300, Apeldoorn, Gelderland, +31 (0)85 760 81 81</div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
`;

export const sendActivationEmail = async (firstName: string, lastName: string, email: string, activationToken: string) => {
    logger.info(`Sending activation email to ${email}`);
    try {
        await sparkpostClient.transmissions.send({
            content: {
                from: 'noreply@brightdigital.dev',
                subject: 'Activate Your Account',
                html: emailTemplate(firstName, lastName, activationToken),
            },
            recipients: [{ address: email }],
        });
    } catch (error) {
        logger.error('Error sending email verification:', error);
        throw error;
    }
};
