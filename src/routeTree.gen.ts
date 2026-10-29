/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AreaPazienteRouteImport } from './routes/area-paziente'
import { Route as ChiSiamoRouteImport } from './routes/chi-siamo'
import { Route as PrenotaRouteImport } from './routes/prenota'
import { Route as ServiziRouteImport } from './routes/servizi'
import { Route as IndexRouteImport } from './routes/index'

const AdminRoute = AdminRouteImport.update({ id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport } as any)
const AreaPazienteRoute = AreaPazienteRouteImport.update({ id: '/area-paziente', path: '/area-paziente', getParentRoute: () => rootRouteImport } as any)
const ChiSiamoRoute = ChiSiamoRouteImport.update({ id: '/chi-siamo', path: '/chi-siamo', getParentRoute: () => rootRouteImport } as any)
const PrenotaRoute = PrenotaRouteImport.update({ id: '/prenota', path: '/prenota', getParentRoute: () => rootRouteImport } as any)
const ServiziRoute = ServiziRouteImport.update({ id: '/servizi', path: '/servizi', getParentRoute: () => rootRouteImport } as any)
const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/servizi': typeof ServiziRoute
  '/prenota': typeof PrenotaRoute
  '/chi-siamo': typeof ChiSiamoRoute
  '/area-paziente': typeof AreaPazienteRoute
  '/admin': typeof AdminRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/servizi': typeof ServiziRoute
  '/prenota': typeof PrenotaRoute
  '/chi-siamo': typeof ChiSiamoRoute
  '/area-paziente': typeof AreaPazienteRoute
  '/admin': typeof AdminRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/servizi': typeof ServiziRoute
  '/prenota': typeof PrenotaRoute
  '/chi-siamo': typeof ChiSiamoRoute
  '/area-paziente': typeof AreaPazienteRoute
  '/admin': typeof AdminRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/servizi' | '/prenota' | '/chi-siamo' | '/area-paziente' | '/admin'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/servizi' | '/prenota' | '/chi-siamo' | '/area-paziente' | '/admin'
  id: '__root__' | '/' | '/servizi' | '/prenota' | '/chi-siamo' | '/area-paziente' | '/admin'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ServiziRoute: typeof ServiziRoute
  PrenotaRoute: typeof PrenotaRoute
  ChiSiamoRoute: typeof ChiSiamoRoute
  AreaPazienteRoute: typeof AreaPazienteRoute
  AdminRoute: typeof AdminRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/servizi': { id: '/servizi'; path: '/servizi'; fullPath: '/servizi'; preLoaderRoute: typeof ServiziRouteImport; parentRoute: typeof rootRouteImport }
    '/prenota': { id: '/prenota'; path: '/prenota'; fullPath: '/prenota'; preLoaderRoute: typeof PrenotaRouteImport; parentRoute: typeof rootRouteImport }
    '/chi-siamo': { id: '/chi-siamo'; path: '/chi-siamo'; fullPath: '/chi-siamo'; preLoaderRoute: typeof ChiSiamoRouteImport; parentRoute: typeof rootRouteImport }
    '/area-paziente': { id: '/area-paziente'; path: '/area-paziente'; fullPath: '/area-paziente'; preLoaderRoute: typeof AreaPazienteRouteImport; parentRoute: typeof rootRouteImport }
    '/admin': { id: '/admin'; path: '/admin'; fullPath: '/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute, ServiziRoute, PrenotaRoute, ChiSiamoRoute, AreaPazienteRoute, AdminRoute,
}
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
