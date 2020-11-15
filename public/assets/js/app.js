/* eslint-disable no-undef */
$.post({
  url: '/api/adduser',
  headers: {
    Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoidG9ueUBhYmMuY29tIiwicGFzc3dvcmQiOiIxMjMifSwiaWF0IjoxNjA1MTY1MzIwLCJleHAiOjE2MDUyNTE3MjB9.J_ioOq2YYGlTXvljJ6dOJ6eRBZ3Z4ZGLYYSK5hLF2Gw',
  },
}).then((res) => console.log(res)).catch((err) => console.log(err));
