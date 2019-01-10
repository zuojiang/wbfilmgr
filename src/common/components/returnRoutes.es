import mobileRoutes from './mobile/routes'
// import desktopRoutes from './desktop/routes'

export default function (userAgent) {
  return mobileRoutes
  // if (userAgent.isMobile) {
  //   return mobileRoutes
  // }
  // return desktopRoutes
}
