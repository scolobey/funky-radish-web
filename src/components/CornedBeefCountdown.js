import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux'
import { subscribeToNewsletter } from "../actions/Actions";

import Popover from "./Popover";

export default function CornedBeefCountdown() {

  const dispatch = useDispatch()

  const [ weeklyToggle, setWeeklyToggle ] = useState(true)
  const [ cornedBeefToggle, setCornedBeefToggle ] = useState(true)
  const [ email, setEmail ] = useState(false)

  const submitEmail = (event) => {
    console.log(weeklyToggle)
    console.log(cornedBeefToggle)
    console.log(email)

    let subCode = 1

    if (weeklyToggle && cornedBeefToggle) {
      subCode = 3
    }
    else if (weeklyToggle) {
      subCode = 2
    }
    else if (!weeklyToggle && !cornedBeefToggle) {
      subCode = 0
    }

    dispatch(subscribeToNewsletter({
      email: email,
      code: subCode
    }))

  };

  const calculateTimeRemaining = () => {
    let year = new Date().getFullYear();
    const difference = + new Date('03/10/2023') - + new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [ timeLeft, setTimeLeft ] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
  });

  return <div className="CornedBeefCountdown">
      <Helmet>
        <meta charSet="utf-8" />
        <title>The Corned Beef Countdown</title>
        <meta name="description" content= "Sign up for the ultimate St. Patrick's Day corned beef tutorial 3/10/2023" />
      </Helmet>

      <div className="countdown">

        <div className="page-title">2023 Corned Beef Countdown</div>

        <div className="timer">
          You have...
          <br></br>
          <div className="counter">
            {timeLeft.days} Days {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds
          </div>

          Until you need to get your next corned beef started, baby!
        </div>

        <form onSubmit={e => {
            e.preventDefault();
            submitEmail(e);
        }}>
          <label><input type="text" name="email" placeholder="email" onChange={(event) => { setEmail(event.target.value) }}/></label>
          <button type="clear">Sign me up</button>
          <br></br>
          { cornedBeefToggle ?
            <input type="checkbox" id="corned_beef" name="newsletter_tag" value="HTML" onClick={(event) => { setCornedBeefToggle(false) }} checked></input>
            :
            <input type="checkbox" id="corned_beef" name="newsletter_tag" value="HTML" onClick={(event) => { setCornedBeefToggle(true) }} ></input>
          }
          <label for="corned_beef">Please remind me to start my next corned beef on March 10th, 2023</label><br></br>

          { weeklyToggle ?
            <input type="checkbox" id="weekly_recipe" name="newsletter_tag" value="Weekly" onClick={(event) => { setWeeklyToggle(false) }} checked></input>
            :
            <input type="checkbox" id="weekly_recipe" name="newsletter_tag" value="Weekly" onClick={(event) => { setWeeklyToggle(true) }} ></input>
          }
          <label for="weekly_recipe">Also send me weekly recipes, if you don't mind.</label><br></br>
        </form>

      </div>



    </div>
}
