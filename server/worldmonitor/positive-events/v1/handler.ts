import type { PositiveEventsServiceHandler } from '../../../../src/generated/server/worldmonitor/positive_events/v1/service_server';
import { listPositiveGeoEvents } from './list-positive-geo-events';

export const positiveEventsHandler: PositiveEventsServiceHandler = {
  listPositiveGeoEvents,
};
