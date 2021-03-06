import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { getClinics, getClinicById } from '../../redux/actions/actions';
import { userActions } from '../../redux/auth/_actions';

import Header from '../header/header';
import Footer from '../footer/footer';

import './clinic.css';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import LinkMaterial from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';

import { makeStyles } from '@material-ui/core/styles';

import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api'
import Geocode from "react-geocode";

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { CircleArrow as ScrollUpButton} from "react-scroll-up-button";

import sanitizeHtml from 'sanitize-html';

import { ToastContainer } from 'react-toastify';


const Clinic = (props) => {

  const [userData, updateUserData] = useState({});
  const [selected, setSelected] = useState(null);
  const [clinicsData, setClinicsData] = useState(null);


  const getClinicById = (id) => {
    axios.get(`http://167.172.109.15/userinfo/clinic/${id}`)
    .then((res) => {
      updateUserData(res.data);
    })
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    getClinicById(props.match.params.id);
    props.getClinics();
  }, [props.match.params.id]);
  
  useEffect(()=> {
    setClinicsData(props.clinics.results);
    if(clinicsData && clinicsData.length > 7) {
      clinicsData.slice(0, 7);
    }
  }, [props.clinics.results, clinicsData])


  /* FOR STARS FUNCTIONALITY */
  const [starsData, setStarsData] = useState({});
  const [flagStars, setFlagStars] = useState(0);
  const handleStars = (event) => {
    setStarsData({
      clinic: Number(props.match.params.id), 
      rating: Number(event.target.value*2)
    });
    setFlagStars(1);
  }
  useEffect(() => {
    if (flagStars===1) {
      props.postClinicFeedback(starsData)
    }
  }, [starsData]);
  

  /* GOOGLE MAPS */
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCLhoRTvmMAP14kkJuL1BW9K03HuLpBytU"
  })
  Geocode.setApiKey("AIzaSyCLhoRTvmMAP14kkJuL1BW9K03HuLpBytU");
  Geocode.setLanguage("ru");
  Geocode.setRegion("ky-KG");
  Geocode.enableDebug();


  /* FOR DOCTORS SHOW MORE BUTTON */
  const useStyles = makeStyles((theme) => ({
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  }));
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  /* FOR TABS */
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  /* FOR DOCTORS SLIDER */
  const customDoctorSlider = useRef();
  const doctorNext = () => {
    customDoctorSlider.current.slickNext();
  }
  const doctorPrevious = () => {
    customDoctorSlider.current.slickPrev();
  }
  const doctors_slider = {
    // infinite: userData.doctors && userData.doctors.length > 3,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    variableWidth: true, 
    // swipeToSlide: true,
    // adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1430,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        }
      },
      {
        breakpoint: 920,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };


  /* FOR CLINICS SLIDER */
  const customClinicSlider = useRef();
  const clinicNext = () => {
    customClinicSlider.current.slickNext();
  }
  const clinicPrevious = () => {
    customClinicSlider.current.slickPrev();
  }
  const clinics_slider = {
    // infinite: clinicsData && clinicsData.length > 3,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    variableWidth: true,
    // adaptiveHeight: true
    responsive: [
      {
        breakpoint: 1430,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          // dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          // dots: true
        }
      },
      {
        breakpoint: 920,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          // initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };


  /* FOR HTML SANITIZER */ 
  const stripHTML = (html) => {
    var clean = sanitizeHtml(html);
    clean = clean.replace(/<(?:.|\n)*?>/gm, "\n");
    clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2}/ig, "\n");
    return clean.trim();
  }


  console.log(userData);


  return (
    <>
      <Header />

      <section className="clinic_page">

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
        <ToastContainer />

        { userData &&
          <Breadcrumbs aria-label="breadcrumb">
            <LinkMaterial color="inherit" onClick={handleClick}>
              <Link id="clinic_page_breadcrumb_passive" to="/">Главная</Link>
            </LinkMaterial>
            <LinkMaterial color="inherit" onClick={handleClick}>
              <Link id="clinic_page_breadcrumb_passive" to="/clinics-search">Клиники</Link>
            </LinkMaterial>
            <LinkMaterial
              color="textPrimary"
              onClick={handleClick}
              aria-current="page"
            >
              <Link id="clinic_page_breadcrumb_active" to={`/clinic/${props.match.params.id}`}>{userData.name}</Link>
            </LinkMaterial>
          </Breadcrumbs>
        }

        { userData &&
          <div className="clinic_page_main">
            <div className="clinic_page_main_left">
              <div id="clinic_page_clinics_data">
                <img id="clinic_page_clinics_data_image" src={require('../../content/images/main/Frame_67.png')} alt="clinic pic"/>
                <div id="clinic_page_clinics_data_info">
                  <Link to="/clinic"><h3>{userData.name}</h3></Link>
                  <p id="clinic_page_clinics_data_info_typeofclinic">Детская клиника</p>
                  <p id="clinic_page_clinics_data_info_article">{stripHTML(userData.description)}</p>
                  <p id="clinic_page_clinics_data_info_address">{userData.address}</p>
                  <div id="clinic_page_clinics_data_info_lastblock">
                    <div id="clinic_page_clinics_data_info_phonegroup">
                      <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.2812 23.9375C11.263 23.9375 9.36686 23.4492 7.59277 22.4727L0 25.5L3.02734 17.9072C2.05078 16.1331 1.5625 14.237 1.5625 12.2188C1.5625 10.6237 1.87174 9.10596 2.49023 7.66553C3.10872 6.2251 3.94287 4.97998 4.99268 3.93018C6.04248 2.88037 7.2876 2.04622 8.72803 1.42773C10.1685 0.809245 11.6862 0.5 13.2812 0.5C14.8763 0.5 16.394 0.809245 17.8345 1.42773C19.2749 2.04622 20.52 2.88037 21.5698 3.93018C22.6196 4.97998 23.4538 6.2251 24.0723 7.66553C24.6908 9.10596 25 10.6237 25 12.2188C25 13.8138 24.6908 15.3315 24.0723 16.772C23.4538 18.2124 22.6196 19.4575 21.5698 20.5073C20.52 21.5571 19.2749 22.3913 17.8345 23.0098C16.394 23.6283 14.8763 23.9375 13.2812 23.9375ZM17.1875 14.5625H15.625L14.7461 15.3438C14.0137 15.1484 13.1144 14.5177 12.0483 13.4517C10.9823 12.3856 10.3516 11.4863 10.1562 10.7539L10.9375 9.875V8.3125C10.9375 8.03581 10.8398 7.75911 10.6445 7.48242C10.4492 7.20573 10.2336 7.00635 9.99756 6.88428C9.76156 6.76221 9.59473 6.75 9.49707 6.84766L8.34961 7.99512C7.71484 8.62988 7.62126 9.61865 8.06885 10.9614C8.51644 12.3042 9.37093 13.6063 10.6323 14.8677C11.8937 16.1291 13.1958 16.9836 14.5386 17.4312C15.8813 17.8787 16.8701 17.7852 17.5049 17.1504L18.6523 16.0029C18.75 15.9053 18.7378 15.7384 18.6157 15.5024C18.4937 15.2664 18.2943 15.0508 18.0176 14.8555C17.7409 14.6602 17.4642 14.5625 17.1875 14.5625Z" fill="#18C661"/>
                      </svg>
                      <p>{userData.phone!=="" ? userData.phone : "Нет данных"}</p>
                    </div>
                    <div id="clinic_page_clinics_data_info_stargroup">
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.003 18.9828C12.3109 18.8065 12.6891 18.8065 12.997 18.9828L18.1996 21.9624C18.9626 22.3994 19.8776 21.7097 19.6676 20.8559L18.3254 15.3975C18.2335 15.0238 18.3642 14.6305 18.6615 14.3861L23.0883 10.748C23.7831 10.1771 23.4299 9.05073 22.5335 8.97868L16.6045 8.50208C16.2401 8.4728 15.9208 8.24707 15.7717 7.91339L13.4129 2.63679C13.0601 1.84758 11.9398 1.84759 11.587 2.63679L9.22835 7.91339C9.07919 8.24707 8.75986 8.4728 8.39553 8.50208L2.46649 8.97868C1.57013 9.05073 1.21695 10.1771 1.91169 10.748L6.33849 14.3861C6.63582 14.6305 6.76653 15.0238 6.67463 15.3975L5.33239 20.8559C5.12242 21.7097 6.03741 22.3994 6.80044 21.9624L12.003 18.9828Z" fill="#F2C94C"/>
                      </svg>
                      <p>{userData.rate ? userData.rate/2 : userData.rate}</p>
                    </div>
                  </div>            
                </div>
              </div>
            </div>
            <div className="clinic_page_main_right">
              <div className="clinic_page_tabs_container">
                <div className={classes.root}>
                  <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                      <Tab label="О клинике" {...a11yProps(0)} />
                      <Tab label="Карта" {...a11yProps(1)} />
                      <Tab label="Прием" {...a11yProps(2)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    <div id="clinic_page_tabs_about">
                      {userData.description==null ? <p>Информация отсутствует...</p> : stripHTML(userData.description)}
                    </div>                 
                  </TabPanel>
                  <TabPanel value={value} index={1}>                  
                    <div id="clinic_page_tabs_map-container">
                      {userData.latitude && userData.longitude ?
                        <GoogleMap
                          id="map"
                          center={{lat: 42.867695, lng: 74.610897}}
                          zoom={12}
                        >
                          <Marker 
                            key={`${userData.latitude}-${userData.longitude}`} 
                            position={{ lat: userData.latitude, lng: userData.longitude }} 
                            onClick={() => {
                              setSelected({lat: userData.latitude, lng: userData.longitude});
                            }}
                          />
                            {selected ? (
                              <InfoWindow 
                                position={{lat: selected.lat, lng: selected.lng}}
                                onCloseClick={() => {
                                  setSelected(null);
                                }}
                              >
                                <div>
                                  <p>Адрес: {userData.address}</p>
                                </div>
                              </InfoWindow>) : null
                            }
                        </GoogleMap>
                        : <p>Клиника не указала местоположение...</p>
                      }
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <div className="clinic_page_tabs_reception">
                      <h1 id="clinic_page_tabs_reception_title">График работы</h1>
                      {
                        userData.schedule !== null 
                        ? <p>{userData.schedule}</p>
                        : <p>Информация отсутствует...</p>
                      }
                      {/* // <h1 id="clinic_page_tabs_reception_title">График работы</h1>
                      // <p id="clinic_page_tabs_reception_article">с ПН по ПТ с 09:00 утра до 24:00</p>
                      // <p id="clinic_page_tabs_reception_article">с СБ  по  ВС выходной</p> */}
                    </div>
                  </TabPanel>
                </div>
              </div>
            </div>
          </div>
        }

        {
          localStorage.getItem('userToken') && localStorage.getItem('userToken') !== 'false' && localStorage.getItem('clientType') !== 'doctor' 
          ? <>
            <h1 id="clinic_page_rating_title">Оценка</h1>
            <div className="clinic_page_rating">
              <p id="clinic_page_rating_p">Оцените работу клиники от 1 до 5</p>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Rating
                  name="simple-controlled"
                  precision={0.5}
                  size="large"
                  value={starsData.rating}
                  onChange={handleStars}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
              </Box>
            </div>
          </>
          : ''
        }

        <h1 id="clinic_page_doctors_title">Врачи этой клиники</h1>

        <div className="clinic_page_doctors">
          <Slider ref={customDoctorSlider} {...doctors_slider}>       
            { userData.doctors && userData.doctors.length > 0 
              ? userData.doctors.map(elem => {
                return(
                  <div id="clinic_page_doctors_slide" key={elem.id}>
                    <img id="clinic_page_doctors_slide_image" src={elem.user.avatar == null ? require('../../content/images/main/image_10.png') : elem.user.avatar} alt="clinic pic"/>
                    <div id="clinic_page_doctors_slide_info">
                      <Link to={`/doctor/${elem.id}`}><h3>{elem.user.last_name} {elem.user.first_name} {elem.user.patronymic}</h3></Link>
                      <div className="clinic_page_doctors_slide_info_chipgroup">
                        {
                          elem.specialty.length === 0
                          ? <p id="clinic_page_doctors_slide_info_specialties">Специализация: отсутствует</p>
                          // : elem.specialty.length > 2 
                          //   ? elem.specialty.map(spec => {
                          //     return(
                          //       <>
                          //         <Chip label={spec.name}/>
                          //         <IconButton
                          //           className={clsx(classes.expand, {
                          //             [classes.expandOpen]: expanded,
                          //           })}
                          //           onClick={handleExpandClick}
                          //           aria-expanded={expanded}
                          //           aria-label="show more"
                          //         >
                          //           <ExpandMoreIcon />
                          //         </IconButton>
                          //         <Collapse in={expanded} timeout="auto" unmountOnExit>
                          //           <Chip label="Психолог"/>
                          //           <Chip label="Психолог"/>
                          //           <Chip label="Психолог"/>
                          //         </Collapse>
                          //       </>
                          //     )
                          //   })
                            : elem.specialty.map(spec => {
                              return(
                                <Chip label={spec.name}/>
                              )
                            })
                        }
                      </div>             
                      {elem.experience !== null
                        ? <p id="clinic_page_doctors_slide_info_experience">Стаж: {elem.experience} лет</p>
                        : <p id="clinic_page_doctors_slide_info_experience">Стаж: отсутствует</p>
                      }
                      {elem.locations.length !== 0 && elem.locations[0].address
                        ? <p id="clinic_page_doctors_slide_info_address">{elem.locations[0].address}</p>
                        : <p id="clinic_page_doctors_slide_info_address">Адрес отсутствует</p>
                      }
                      <div id="clinic_page_doctors_slide_info_lastblock">
                        <div id="clinic_page_doctors_slide_info_phonegroup">
                          <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.2812 23.9375C11.263 23.9375 9.36686 23.4492 7.59277 22.4727L0 25.5L3.02734 17.9072C2.05078 16.1331 1.5625 14.237 1.5625 12.2188C1.5625 10.6237 1.87174 9.10596 2.49023 7.66553C3.10872 6.2251 3.94287 4.97998 4.99268 3.93018C6.04248 2.88037 7.2876 2.04622 8.72803 1.42773C10.1685 0.809245 11.6862 0.5 13.2812 0.5C14.8763 0.5 16.394 0.809245 17.8345 1.42773C19.2749 2.04622 20.52 2.88037 21.5698 3.93018C22.6196 4.97998 23.4538 6.2251 24.0723 7.66553C24.6908 9.10596 25 10.6237 25 12.2188C25 13.8138 24.6908 15.3315 24.0723 16.772C23.4538 18.2124 22.6196 19.4575 21.5698 20.5073C20.52 21.5571 19.2749 22.3913 17.8345 23.0098C16.394 23.6283 14.8763 23.9375 13.2812 23.9375ZM17.1875 14.5625H15.625L14.7461 15.3438C14.0137 15.1484 13.1144 14.5177 12.0483 13.4517C10.9823 12.3856 10.3516 11.4863 10.1562 10.7539L10.9375 9.875V8.3125C10.9375 8.03581 10.8398 7.75911 10.6445 7.48242C10.4492 7.20573 10.2336 7.00635 9.99756 6.88428C9.76156 6.76221 9.59473 6.75 9.49707 6.84766L8.34961 7.99512C7.71484 8.62988 7.62126 9.61865 8.06885 10.9614C8.51644 12.3042 9.37093 13.6063 10.6323 14.8677C11.8937 16.1291 13.1958 16.9836 14.5386 17.4312C15.8813 17.8787 16.8701 17.7852 17.5049 17.1504L18.6523 16.0029C18.75 15.9053 18.7378 15.7384 18.6157 15.5024C18.4937 15.2664 18.2943 15.0508 18.0176 14.8555C17.7409 14.6602 17.4642 14.5625 17.1875 14.5625Z" fill="#18C661"/>
                          </svg>
                          <p>{elem.user.phone}</p>
                        </div>
                        <div id="clinic_page_doctors_slide_info_stargroup">
                          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.003 18.9828C12.3109 18.8065 12.6891 18.8065 12.997 18.9828L18.1996 21.9624C18.9626 22.3994 19.8776 21.7097 19.6676 20.8559L18.3254 15.3975C18.2335 15.0238 18.3642 14.6305 18.6615 14.3861L23.0883 10.748C23.7831 10.1771 23.4299 9.05073 22.5335 8.97868L16.6045 8.50208C16.2401 8.4728 15.9208 8.24707 15.7717 7.91339L13.4129 2.63679C13.0601 1.84758 11.9398 1.84759 11.587 2.63679L9.22835 7.91339C9.07919 8.24707 8.75986 8.4728 8.39553 8.50208L2.46649 8.97868C1.57013 9.05073 1.21695 10.1771 1.91169 10.748L6.33849 14.3861C6.63582 14.6305 6.76653 15.0238 6.67463 15.3975L5.33239 20.8559C5.12242 21.7097 6.03741 22.3994 6.80044 21.9624L12.003 18.9828Z" fill="#F2C94C"/>
                          </svg>
                          <p>{elem.rate ? elem.rate/2 : elem.rate}</p>
                        </div>
                      </div>            
                    </div>
                  </div>
                )
              })
              : <p>Врачи отсутствуют...</p>
            } 
          </Slider>
          {
            userData.doctors && userData.doctors.length > 3 &&
            <div className="clinic_page_doctors_button_group">
              <button id="clinic_page_doctors_button_group_prev" onClick={doctorPrevious}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M41.6667 26C41.6667 25.4477 41.219 25 40.6667 25H16.1459L26.418 14.7279C26.7919 14.3541 26.8101 13.7538 26.4596 13.3579L26.4045 13.2957C26.0226 12.8643 25.3561 12.844 24.9487 13.2514L12.8655 25.3346C12.475 25.7251 12.475 26.3583 12.8655 26.7488L24.9487 38.8319C25.3561 39.2393 26.0226 39.2191 26.4045 38.7877L26.4596 38.7254C26.8101 38.3296 26.7919 37.7293 26.418 37.3554L16.1459 27.0833H40.6667C41.219 27.0833 41.6667 26.6356 41.6667 26.0833V26Z"/>
                </svg>
              </button>
              <button id="clinic_page_doctors_button_group_next" onClick={doctorNext}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.33325 26C8.33325 25.4477 8.78097 25 9.33325 25H33.8541L23.582 14.7279C23.2081 14.3541 23.1899 13.7538 23.5404 13.3579L23.5955 13.2957C23.9774 12.8643 24.6439 12.844 25.0513 13.2514L37.1345 25.3346C37.525 25.7251 37.525 26.3583 37.1345 26.7488L25.0513 38.8319C24.6439 39.2393 23.9774 39.2191 23.5955 38.7877L23.5404 38.7254C23.1899 38.3296 23.2081 37.7293 23.582 37.3554L33.8541 27.0833H9.33325C8.78097 27.0833 8.33325 26.6356 8.33325 26.0833V26Z"/>
                </svg>
              </button>
            </div>
          }
        </div>

        <h1 id="clinic_page_clinics_title">Другие клиники</h1>

        <div className="clinic_page_clinics">
          <Slider ref={customClinicSlider} {...clinics_slider}>
            {
              clinicsData &&
              clinicsData.filter(val => val.id !== userData.id).map(elem => {
                return(
                  <div id="clinic_page_clinics_slide">
                    <img id="clinic_page_clinics_slide_image" src={require('../../content/images/main/Frame_67.png')} alt="clinic pic"/>
                    <div id="clinic_page_clinics_slide_info">
                      <Link to={`/clinic/${elem.id}`}><h3>{elem.name}</h3></Link>
                      <p id="clinic_page_clinics_slide_info_typeofclinic">Детская клиника</p>
                      <p id="clinic_page_clinics_slide_info_article">{stripHTML(elem.description)}</p>
                      <p id="clinic_page_clinics_slide_info_address">{elem.address}</p>
                      <div id="clinic_page_clinics_slide_info_lastblock">
                        <div id="clinic_page_clinics_slide_info_phonegroup">
                          <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.2812 23.9375C11.263 23.9375 9.36686 23.4492 7.59277 22.4727L0 25.5L3.02734 17.9072C2.05078 16.1331 1.5625 14.237 1.5625 12.2188C1.5625 10.6237 1.87174 9.10596 2.49023 7.66553C3.10872 6.2251 3.94287 4.97998 4.99268 3.93018C6.04248 2.88037 7.2876 2.04622 8.72803 1.42773C10.1685 0.809245 11.6862 0.5 13.2812 0.5C14.8763 0.5 16.394 0.809245 17.8345 1.42773C19.2749 2.04622 20.52 2.88037 21.5698 3.93018C22.6196 4.97998 23.4538 6.2251 24.0723 7.66553C24.6908 9.10596 25 10.6237 25 12.2188C25 13.8138 24.6908 15.3315 24.0723 16.772C23.4538 18.2124 22.6196 19.4575 21.5698 20.5073C20.52 21.5571 19.2749 22.3913 17.8345 23.0098C16.394 23.6283 14.8763 23.9375 13.2812 23.9375ZM17.1875 14.5625H15.625L14.7461 15.3438C14.0137 15.1484 13.1144 14.5177 12.0483 13.4517C10.9823 12.3856 10.3516 11.4863 10.1562 10.7539L10.9375 9.875V8.3125C10.9375 8.03581 10.8398 7.75911 10.6445 7.48242C10.4492 7.20573 10.2336 7.00635 9.99756 6.88428C9.76156 6.76221 9.59473 6.75 9.49707 6.84766L8.34961 7.99512C7.71484 8.62988 7.62126 9.61865 8.06885 10.9614C8.51644 12.3042 9.37093 13.6063 10.6323 14.8677C11.8937 16.1291 13.1958 16.9836 14.5386 17.4312C15.8813 17.8787 16.8701 17.7852 17.5049 17.1504L18.6523 16.0029C18.75 15.9053 18.7378 15.7384 18.6157 15.5024C18.4937 15.2664 18.2943 15.0508 18.0176 14.8555C17.7409 14.6602 17.4642 14.5625 17.1875 14.5625Z" fill="#18C661"/>
                          </svg>
                          <p>{elem.phone!=="" ? elem.phone : "Нет данных"}</p>
                        </div>
                        <div id="clinic_page_clinics_slide_info_stargroup">
                          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.003 18.9828C12.3109 18.8065 12.6891 18.8065 12.997 18.9828L18.1996 21.9624C18.9626 22.3994 19.8776 21.7097 19.6676 20.8559L18.3254 15.3975C18.2335 15.0238 18.3642 14.6305 18.6615 14.3861L23.0883 10.748C23.7831 10.1771 23.4299 9.05073 22.5335 8.97868L16.6045 8.50208C16.2401 8.4728 15.9208 8.24707 15.7717 7.91339L13.4129 2.63679C13.0601 1.84758 11.9398 1.84759 11.587 2.63679L9.22835 7.91339C9.07919 8.24707 8.75986 8.4728 8.39553 8.50208L2.46649 8.97868C1.57013 9.05073 1.21695 10.1771 1.91169 10.748L6.33849 14.3861C6.63582 14.6305 6.76653 15.0238 6.67463 15.3975L5.33239 20.8559C5.12242 21.7097 6.03741 22.3994 6.80044 21.9624L12.003 18.9828Z" fill="#F2C94C"/>
                          </svg>
                          <p>{elem.rate ? elem.rate/2 : elem.rate}</p>
                        </div>
                      </div>            
                    </div>
                  </div>
                )
              })
            }
          </Slider>
          {
            clinicsData && clinicsData.length > 3 &&
            <div className="clinic_page_clinics_button_group">
              <button id="clinic_page_clinics_button_group_prev" onClick={clinicPrevious}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M41.6667 26C41.6667 25.4477 41.219 25 40.6667 25H16.1459L26.418 14.7279C26.7919 14.3541 26.8101 13.7538 26.4596 13.3579L26.4045 13.2957C26.0226 12.8643 25.3561 12.844 24.9487 13.2514L12.8655 25.3346C12.475 25.7251 12.475 26.3583 12.8655 26.7488L24.9487 38.8319C25.3561 39.2393 26.0226 39.2191 26.4045 38.7877L26.4596 38.7254C26.8101 38.3296 26.7919 37.7293 26.418 37.3554L16.1459 27.0833H40.6667C41.219 27.0833 41.6667 26.6356 41.6667 26.0833V26Z"/>
                </svg>
              </button>
              <button id="clinic_page_clinics_button_group_next" onClick={clinicNext}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.33325 26C8.33325 25.4477 8.78097 25 9.33325 25H33.8541L23.582 14.7279C23.2081 14.3541 23.1899 13.7538 23.5404 13.3579L23.5955 13.2957C23.9774 12.8643 24.6439 12.844 25.0513 13.2514L37.1345 25.3346C37.525 25.7251 37.525 26.3583 37.1345 26.7488L25.0513 38.8319C24.6439 39.2393 23.9774 39.2191 23.5955 38.7877L23.5404 38.7254C23.1899 38.3296 23.2081 37.7293 23.582 37.3554L33.8541 27.0833H9.33325C8.78097 27.0833 8.33325 26.6356 8.33325 26.0833V26Z"/>
                </svg>
              </button>
            </div>
          }
            
        </div>

        <ScrollUpButton ShowAtPosition={350}/>

      </section>

      <Footer />
    </>
  )
}


const mapStateToProps = state => {
  const { adding, added } = state.postClinicFeedback;
  return {
    clinics: state.getClinics.clinics,
    clinicById: state.getClinicById.clinicById,
    adding, added
  }
}

const mapDispatchToProps = {
  getClinicById,
  getClinics,
  postClinicFeedback: userActions.postClinicFeedback
} 


export default connect(mapStateToProps, mapDispatchToProps)(Clinic);


/* FOR TABS */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


/* FOR BREADCRUMBS */
function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}