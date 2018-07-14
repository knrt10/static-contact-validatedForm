
<p align="center">
<img src="https://user-images.githubusercontent.com/24803604/42569454-28c50a24-852e-11e8-8a7a-fa424515587d.png" />
</p>

## What is its use?

You can add a contact form in your static website like site hosted on Github and able to get response from user.

### Some Cool Features

Sometimes people try to span your email and you get anonymous emails. To avoid this, I have created this so that one has to authenticate their emails before sending message to you.

- Avoid Spam emails
- Can add as many **name** fields in your HTML form.
- Get IP address of the sender

## Preview

![Preview](https://res.cloudinary.com/dsyvg5xwi/image/upload/v1531587414/out3_hpfi8i.gif)

## How to use

1.) fork the repository

2.) Host it on any domain you want, I would suggest [Glitch](https://glitch.com/)

3.) Add an `.env` file in your root folder for reference see [.env.example](https://github.com/knrt10/static-contact-validatedForm/blob/master/.env.example)

4.) Add this to form in your static site

In **action** field of form add *your hosted URL/verify* , where hosted URL is one when you host the code on Glitch, Herkou, AWS type services.

```html
<form method="GET" action="your hosted URL/verify" accept-charset="UTF-8" >
  <input id="name" type="text" name="name" required placeholder="Example:- Messi | Ronaldo">
  <input id="email" type="email" name="email" placeholder="Example:- messi@ronaldo.com" required>                
  <textarea id="textarea" name="message" placeholder="Enter your message" required ></textarea>
  <button type="submit">Send</button>
</form>
```

**name** field in html form for **email** field is mandatory. Rest you can add as many as you want.

:fire: Enjoy.

## license

MIT @knrt10
