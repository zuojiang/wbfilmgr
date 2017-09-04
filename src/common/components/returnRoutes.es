import desktopRoutes from './desktop/routes'
import mobileRoutes from './mobile/routes'

export default function (userAgent) {
  return mobileRoutes
  // if (userAgent.isMobile) {
  //   return mobileRoutes
  // }
  // return desktopRoutes
}
