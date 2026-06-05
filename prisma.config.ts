export default {
  // datasource can still be used for Migrate connection strings
  // but Prisma 7+ prefers config for client instantiation
  datasource: {
    url: "file:./dev.db"
  }
}
