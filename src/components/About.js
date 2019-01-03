import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div className="AboutContainer">
        <div className="About">
          <h1>
            About
          </h1>
          <p>My name is Ryan. I've spent a lot of time in kitchens. But that's besides the point...</p>
          <p>Did you ever think maybe it'd be nice to be able to store your recipes on your phone? Not in a lame, social media kinda way, just actually have all of your recipes in one place, downloadable and backed up so you can find them easily when you're cooking?</p>
          <p>If you have had this thought, and you've looked around to see if there's an app that fills that need, you may have noticed something. Recipe apps are designed as promotional tools. They aren't designed to help serious cooks store and access recipes.</p>
          <p>It seems odd at first. Why wouldn't a recipe app be designed to store and access recipes?</p>
          <p>Well... That's not how you make money. Most app users are not cooks. And, if you're not a cook and you download a recipe app, you're actually not looking for a recipe storage system, you're looking for pictures and videos to share with your friends. Maybe, eventually, you might try to cook something, but for now, you're only browsing. So recipe apps are designed to appeal to consumers, not creators. Because consumers generate more traffic and ultimately more ad revenue. If a recipe app has any features that are customized to serious cooks, it's only in an attempt to bait them into recording their recipes so they can be packaged and used to generate views. Personally, I think that's disingenuous.</p>
          <p>So yeah, that's why I built FunkyRadish. So that hopefully someday you or your grandma or your friends have a place to record and exchange the recipes that mean something to you so that they can live on for years to come. It's still a little rough. Sorry... but I'm a cook, not a software developer. For now, it works, and it's going to keep getting better. If you want to help it keep getting better, use it, and reach out to offer your feedback. Maybe check out our <a href='./roadmap'>roadmap</a> to see what the plan is. Or shoot me an email at minedied@gmail.com</p>
        </div>
      </div>
    );
  }
}

export default About;
