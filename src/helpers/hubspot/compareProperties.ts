import type { PropertyField } from '../../typings/PropertyField';

import logger from '../../utils/Logger';

export const compareProperties = async (currentProperties: any, propertyFields: PropertyField[]): Promise<void> => {
  const missingFields = propertyFields.filter((propertyField) => {
    // @ts-ignore
    return !currentProperties.some((currentProperty) => currentProperty.name === propertyField.name);
  });

  if (missingFields.length === 0) {
    logger.info('All properties have been created');
  } else {
    logger.info('The following properties are not yet created..');
    missingFields.forEach((missingField) => {
      logger.info(missingField.name);
    });
  }
};
