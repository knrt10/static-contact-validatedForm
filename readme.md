
<p align="center">
<img src="https://user-images.githubusercontent.com/24803604/42559530-f6fece56-8511-11e8-93d3-3a286f82db48.png" />
</p>

## What is its use?

You can add a contact form in your static website like site hosted on Github and able to get response from user.

### Additional Features

Sometimes people try to span your email and you get anonymous emails. To avoid this, I have created this so that one has to authenticate their emails before sending message to you.

## Preview

## How to use

1.) clone the repository

- git clone `https://github.com/knrt10/static-contact-validatedForm.git`

2.) Host it on any domain you want, I would suggest [Glitch](https://glitch.com/)

3.) Add an `.env` file in your root folder for reference see [.env.example](https://github.com/knrt10/static-contact-validatedForm/blob/master/.env.example)

4.) Add this to form in your static site

```html
<form method="GET" action="your hosted URL/verify" accept-charset="UTF-8" >
  <input id="name" type="text" name="name" required placeholder="Example:- Messi | Ronaldo">
  <input id="email" type="email" name="email" placeholder="Example:- messi@ronaldo.com" required>                
  <textarea id="textarea" name="message" placeholder="Enter your message" required ></textarea>
  <button type="submit">Send</button>
</form>
```

**name** fields in html form should be same for form to work and no extra fields should be added, you can add your own CSS.

:fire: Enjoy.

## license

MIT @knrt10
