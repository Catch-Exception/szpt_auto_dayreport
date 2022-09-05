import createServer from './server'
import createDatabase from './db'

declare global {
  var TiServer: createServer;
  var TiDatabase: createDatabase;
}

export { }