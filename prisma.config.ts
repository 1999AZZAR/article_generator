export default {
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://quill:quilldev@localhost:5432/quill',
  },
};
