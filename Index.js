const DiscordHybridClient = require('discord-hybrid-api-client');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new DiscordHybridClient({
  token: process.env.TOKEN || '',
  loginType: 'auth'
});

rl.question('Choose an option:\n1) Token\n2) Email and Password\n', (answer) => {
  if (answer === '1') {
    rl.question('Enter your Discord token: ', (token) => {
      client.login(token);
    });
  } else if (answer === '2') {
    rl.question('Enter your Discord email: ', (email) => {
      rl.question('Enter your Discord password: ', (password) => {
        client.login({ email, password });
      });
    });
  }

  rl.question('Enter the server invite: ', (invite) => {
    client.inviteAccept(invite)
      .then(() => {
        rl.question('Enter the channel ID: ', (channelId) => {
          const channel = client.guilds.cache.get(client.guilds.cache.keys().next().value).channels.cache.get(channelId);
          if (!channel) {
            console.error('Unable to find the channel.');
            return;
          }

          rl.question('Enter the message to spam: ', (message) => {
            setInterval(() => {
              channel.createMessage(message);
            }, 1000);
          });
        });
      })
      .catch(console.error);
  });
});
