import { Box, Typography, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { gifYes, gifNo, gifSecret, noList, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES, passCode } from '../constants';
import { ColorButton } from '../styledComponents';


const gapi = window.gapi
const google = window.google

let tokenClient;

const AskThem = () => {
  const [yes, setYes] = useState(false)
  const [noSentence, setNoSentence] = useState(noList[0])
  const [noCount, setNoCount] = useState(0)
  const [gif, setGif] = useState(gifNo)
  const [yesFont, setYesFont] = useState(14)
  const [gapiInited, setGapiInited] = useState(false)
  const [gisInited, setGisInited] = useState(false)
  const [secretCodeEntered, setSecretCodeEntered] = useState(false)
  const [textFieldValue, setTextFieldValue] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSecondHint, setShowSecondHint] = useState(false)
  
  useEffect(() => {
    setGif(() => secretCodeEntered ? gifSecret : yes ? gifYes : gifNo)
      }, [yes, secretCodeEntered])
  
  useEffect(() => {
    if(gisInited && gapiInited && tokenClient) {
      handleAuthClick()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gisInited, gapiInited])

  const noClick = () => {
    const newNoCount = noCount >= noList.length - 1 ? 0 : noCount+1
    setNoCount(newNoCount)
    setNoSentence(noList[newNoCount])
    setYesFont(yesFont < 500 ? yesFont+20 : yesFont)
  }

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true)
  }

  function gisLoaded() {
    tokenClient = google?.accounts?.oauth2?.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
    });
    setGisInited(true)
  }

  function handleAuthClick() {
    if (tokenClient) {
      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw (resp);
        }
        await sendEventToCalendar();
      };

      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
      }
    }
  }

  async function sendEventToCalendar() {
    var event = {
      'summary': "Valentine's day 2024 🖤🩵",
      'location': 'New York, NYC',
      'description': 
        "You're my valentine. 🌹 \n• We start off our day by going in to the google office https://maps.app.goo.gl/FFwYW4DUtcCi1XkL6 \n• Then our date starts after work ⛴️🌊",
      'start': {
        'dateTime': '2024-02-14T19:00:00',
        'timeZone': 'America/New_York'
      },
      'end': {
        'dateTime': '2024-02-14T22:00:00',
        'timeZone': 'America/New_York'
      },
      'status': 'confirmed',
      'colorId': '11',
      'attendees': [
        {'email': 'yathamnehal1@gmail.com'},
        {'email': 'reddi.sasya@gmail.com'}
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10}
        ]
      }
    };
    
    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });

    window.setEvent = true

    request.execute(function(event) {
      window.open(event.htmlLink)
    });
  }

  const handleEventClick = () => {
    gapiLoaded()
    gisLoaded()
  }

  const handleTextFieldChange = ({target: { value }}) => {
    setTextFieldValue(value)
    if (value === passCode) {
      setSecretCodeEntered(true)
    } else {
      setSecretCodeEntered(false)
    }
  }
  return (
  <>
      <img src={gif} alt='gif' style={{ height: '250px' }} />
      <Typography variant='h3' gutterBottom> 
        {secretCodeEntered ? 
          <>Click that Thing Now !!!</> 
          : 
          !yes ? <div>Will you be my Valentine?</div> : <div>Ok Yay!!!</div>
        }
      </Typography>

      {!yes ? (
        <Box>
            <ColorButton 
                variant='contained' 
                color='primary' 
                onClick={()=>setYes(true)}
                style = {{
                    fontSize: `${yesFont}px`,
                    marginRight: '20px',
                }}
            >
                Yes
            </ColorButton>
            <ColorButton
                variant='contained'
                color='secondary' 
                onClick={() => noClick()}
            >
                {noSentence}
            </ColorButton>
        </Box>
      ) :
        <>
        {!secretCodeEntered ? 
          <>
            <div>...</div>
            <div>Then Please enter the secret Code! :D</div>
          </>
          : ''}
          
          <TextField 
            label='Enter Secret Code:' 
            type='password'
            variant='outlined'
            error={textFieldValue!==passCode}
            style={{marginTop: '20px', width: '300px'}}
            onChange={handleTextFieldChange}
          />

          <Button 
            color={secretCodeEntered ? 'primary': 'secondary'}
            variant='text' 
            onClick={handleEventClick}
            style={{marginTop: '20px', textTransform: 'capitalize'}}
            className={!secretCodeEntered ? 'disable-pointer-for-button' : ''}
          > 
          {secretCodeEntered 
            ? 
              <>Good Job. Better be ready!! 🎉</>
            : 
              <>
                Enter the secret Code to Enter! 🔒
              </>
          } 
          </Button>
          
          {!showHint && !secretCodeEntered
            ? 
              <Button color='secondary' variant='contained' onClick={()=>setShowHint(true)} >
                Show Hint!
              </Button> 
            : 
              <>
              {!secretCodeEntered && 
              <>
                <pre className='hint-text'>
                    I Store things for you.
                    <br />
                    Without them, your options are limited too.
                    <br />
                    <br />
                    This is where you keep your hard earned bread.
                    <br />
                    The more sophisticated say I'm crimson, but I say I'm red!
                    <br />
                    <br />
                    The code is in the corner which you rarely use.
                    <br />
                    But today, this is what you must choose.
                </pre>
                  {!showSecondHint ? 
                      <Button color='secondary' variant='contained' onClick={() => setShowSecondHint(true)}>
                        Show Second Hint!
                      </Button> 
                    :
                    <>
                      <img src={process.env.PUBLIC_URL + '/red_clutch.jpeg'} alt='red clutch' style={{height: '150px', marginTop: '30px'}}/>
                      <pre className='hint-text'>
                        If you didnt get it for whatever reason, click <a href='https://textsaver.flap.tv/lists/6ako'>here</a> for the answer
                      </pre>
                    </>
                  }
                  </>
                }
              </>
            }
          
        </>
        }
        </>
  )
} 

export default AskThem