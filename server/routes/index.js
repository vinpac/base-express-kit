const express = require('express');
const router = express.Router();

const renderApp = params => (req, res) => res.render("index", params)

module.exports = () => {
  router
    .get('/profile', renderApp({
      title: 'Profile',
      jsonToClient: JSON.stringify({ user: { id: 1, name: 'John'}}),
      metas: [
        { name: 'name', content: 'Profile 1' }
      ]
    }))
    .get('/', renderApp({
      title: 'Home',
      metas: [
        {
          name: "description",
          content: "Express Server with webpack hot reloading is an awesome module for you",
          repeat_with_prefix: [ 'og:' ]
        },
      ]
    }))
  return router
}
