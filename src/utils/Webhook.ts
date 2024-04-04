import webHookController from '../controllers/Webhook'
import logger from './Logger';

export const initializeWebhook = async () => {
    const targetUrl = process.env.NGROK_FORWARDING_URL ?? '';

    const webHook = await webHookController.getWebHook();
  
    if (webHook && targetUrl !== '' && webHook.targetUrl !== targetUrl) {
      webHookController.updateWebHook('ROLLING_MINUTE', 10, targetUrl);
    }
  
    if (!webHook && targetUrl !== '' ) {
      await webHookController.createWebHook('ROLLING_MINUTE', 10, targetUrl); 
    }
  
    const webHookSubscriptions = await webHookController.getSubcriptions();
  
    const hasDossierNumberSubscription = webHookSubscriptions.some((subscription: { propertyName: string; }) => {
      return subscription.propertyName === 'dossier_number';
    });
  
    if (!hasDossierNumberSubscription) {
      logger.info('No subscription with dossier_number found..');
      await webHookController.createSubscription('dossier_number', true, 'company.propertyChange')
    }
}

