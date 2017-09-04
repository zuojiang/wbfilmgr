import desktopRoutes from './desktop/routes'
import mobileRoutes from './mobile/routes'

export default function (userAgent) {
  if (userAgent.isMobile) {
    return mobileRoutes
  }
  return desktopRoutes
}
