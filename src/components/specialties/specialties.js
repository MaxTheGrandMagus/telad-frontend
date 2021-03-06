import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getSpecialties, getCities, getFilterData, setFilterItems } from '../../redux/actions/actions';

import Header from '../header/header';
import Footer from '../footer/footer';

import './specialties.css';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import LinkMaterial from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { CircleArrow as ScrollUpButton } from "react-scroll-up-button";

import AlpabetSorter from 'react-alphabet-sorter'


const Specialties = (props) => {

  useEffect(() => {
    window.scrollTo(0, 0);
    props.getSpecialties();
    props.getCities();
  }, []);


  const [selected, setSelected] = useState({});
  const [navigator, setNavigator] = useState(true);
  const [specsState, setSpecsState] = useState(null);

  useEffect(()=> {
    setSpecsState(props.specialties.results)
  }, [props.specialties.results])
  console.log(specsState);
  // useEffect(()=> {
  //   if(specsState!== null && specsState!== undefined) {
  //     specsState.forEach(() => {
  //       setSpecsState(state => ({...state, href: '/search'}))
  //     })
  //   }
  // }, [specsState])

  const toggleNavigator = () => {
    setNavigator({ navigator: !navigator })
  }

  const handleSorter = (key, selected) => {
    setSelected({
      selected: {
        ...selected,
        [key]: selected,
      }
    })
  }

  const handleSelect = (key, selected) => {
    let result
    if (Array.isArray(selected)) {
      result = selected.length > 0 ? [...selected] : []
    } else {
      result = [selected]
    }
    setSelected({
      selected: {
        ...selected,
        [key]: result,
      },
    })
  }



  /* FOR AUTOCOMPLETE GROUP */
  const search_options1 = props.specialties.results && props.specialties.results.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });
  const search_options2 = props.cities && props.cities.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });
  const search_options3 = radius.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  // const handleSorter = (selected) => {
  //   console.log(selected)
  // }
  const specs = props.specialties.results;

  return (
    <>
      <Header />

      <section className="specialties_page">

        <Breadcrumbs aria-label="breadcrumb">
          <LinkMaterial color="inherit" onClick={handleClick}>
            <Link id="specialties_page_breadcrumb_passive" to="/">Главная</Link>
          </LinkMaterial>
          <LinkMaterial
            color="textPrimary"
            onClick={handleClick}
            aria-current="page"
          >
            <Link id="specialties_page_breadcrumb_active" to="/specialties">Специальности</Link>
          </LinkMaterial>
        </Breadcrumbs>

        <h1 id="specialties_page_article1">Специальности</h1>

        <h4 id="specialties_page_article2">Поиск врача</h4>

        <div className="specialties_page_search_group">
          <Autocomplete
            id="grouped-demo"
            options={search_options1 && search_options1.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.name}
            style={{ width: "26%" }}
            renderInput={(params) => <TextField {...params} label="Врач, специальность" variant="outlined" />}
            value={ selected.single_search && selected.single_search[0] }
            onChange={ (selected) => handleSelect('single_search', selected) }
          />
          <Autocomplete
            id="grouped-demo"
            options={search_options2 && search_options2.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.name}
            style={{ width: "26%" }}
            renderInput={(params) => <TextField {...params} label="Город" variant="outlined" />}
          />
          <Autocomplete
            id="grouped-demo"
            options={search_options3 && search_options3.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            style={{ width: "26%" }}
            renderInput={(params) => <TextField {...params} label="Радиус" variant="outlined" />}
          />
          <Link to="/search"><button id="specialties_page_search_button">Найти</button></Link>
        </div>

        {/* <div className="specialties_page_specialties">
          <div id="specialties_page_specialties_slide">
            <div id="specialties_page_specialties_slide_left">
              <h3>Кардиолог</h3>
              <p>20</p>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.20477 5.95121C7.01192 5.95121 6.04492 6.91821 6.04492 8.11106C6.04492 9.30391 7.01192 10.2709 8.20477 10.2709C9.39761 10.2709 10.3646 9.30391 10.3646 8.11106C10.3646 6.91821 9.39761 5.95121 8.20477 5.95121ZM4.9668 8.11106C4.9668 6.32278 6.41649 4.87309 8.20477 4.87309C9.99305 4.87309 11.4427 6.32278 11.4427 8.11106C11.4427 9.89934 9.99305 11.349 8.20477 11.349C6.41648 11.349 4.9668 9.89934 4.9668 8.11106Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.19028 11.9456C8.97863 11.9452 9.75935 12.1 10.4878 12.4013C11.2164 12.7027 11.8785 13.1447 12.4362 13.702C12.9939 14.2594 13.4364 14.9212 13.7382 15.6496C14.0401 16.378 14.1954 17.1587 14.1954 17.9472V18.4863H2.18872V17.9472C2.18872 16.3555 2.82103 14.829 3.94654 13.7034C5.07197 12.578 6.5987 11.9457 8.19028 11.9456C8.1904 11.9456 8.19017 11.9456 8.19028 11.9456ZM8.19028 12.4847V11.9456V12.4847ZM8.19028 13.0238C6.88451 13.0238 5.63221 13.5425 4.70889 14.4658C3.91352 15.2612 3.41839 16.3006 3.29643 17.4081H2.72778V17.9472H3.26685C3.26685 17.7662 3.27681 17.5863 3.29643 17.4081H13.0877C13.1074 17.5868 13.1173 17.7667 13.1173 17.9472H13.6564V17.4081H13.0877C13.0368 16.9464 12.9208 16.4932 12.7422 16.0623C12.4946 15.4648 12.1317 14.9219 11.6741 14.4646C11.2166 14.0074 10.6735 13.6448 10.0758 13.3976C9.47804 13.1504 8.83711 13.0233 8.19028 13.0238Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8593 8.147C14.9562 8.147 14.2241 8.87909 14.2241 9.78216C14.2241 10.6852 14.9562 11.4173 15.8593 11.4173C16.7623 11.4173 17.4944 10.6852 17.4944 9.78216C17.4944 8.87909 16.7623 8.147 15.8593 8.147ZM13.146 9.78216C13.146 8.28366 14.3608 7.06888 15.8593 7.06888C17.3578 7.06888 18.5726 8.28366 18.5726 9.78216C18.5726 11.2807 17.3578 12.4954 15.8593 12.4954C14.3608 12.4954 13.146 11.2807 13.146 9.78216Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8588 13.0094C16.5079 13.0079 17.1509 13.1345 17.7511 13.3818C18.3516 13.6292 18.8974 13.9927 19.3572 14.4513C19.817 14.91 20.1818 15.4549 20.4307 16.0548C20.6796 16.6546 20.8077 17.2977 20.8077 17.9472L20.8077 18.4863H15.2374V17.4081H19.6917C19.6463 17.0859 19.5601 16.7699 19.4349 16.468C19.2403 15.9991 18.9552 15.5732 18.5957 15.2146C18.2363 14.8561 17.8097 14.572 17.3404 14.3786C16.871 14.1852 16.3681 14.0863 15.8604 14.0875L15.8584 14.0875C15.2264 14.0867 14.6038 14.2415 14.0458 14.5383L13.5396 13.5864C14.2536 13.2066 15.0501 13.0085 15.8588 13.0094Z" fill="white"/>
              </svg>
            </div>              
            <svg id="specialties_page_specialties_slide_right" width="11" height="21" viewBox="0 0 11 21" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.125 1.75L9.875 10.5L1.125 19.25"/>
            </svg>
          </div>
        </div> */}

        {/* <AlpabetSorter
          asGroup={specs}
          asName='usage_example'
          valueKey="id"
          labelKey="name"
          type='radio'
          handleCheck={handleSorter} 
        /> */}
        {/* <AlpabetSorter
          asGroup={ specs }
          selected={ selected.single_search }
          asName="single_search"
          valueKey="id"
          labelKey="name"
          navigator={ navigator }
          type="radio"
          handleCheck={ (selected) => handleSorter('single_search', selected) }
        /> */}
        {
          specsState && 
          <AlpabetSorter
            asGroup={ specsState }
            asName="link"
            valueKey="id"
            labelKey="name"
            navigator={ navigator }
            type="link"
            itemOptions={{target: 'checkbox'}}
          />
        }
        

        <ScrollUpButton ShowAtPosition={350}/>

      </section>
      
      <Footer />
    </>
  )
}


const mapStateToProps = state => {
  return {
    data: state.getDoctors.data,
    specialties: state.getSpecialties.specialties,
    cities: state.getCities.cities,
  }
}

const mapDispatchToProps = {
  getSpecialties,
  getCities,
}


export default connect(mapStateToProps, mapDispatchToProps)(Specialties);


/* FOR BREADCRUMBS */
function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}


/* DATA FOR AUTOCOMPLETE */
const radius = [
  { title: '500 м', id: 1 },
  { title: '1 км', id: 2 },
  { title: '3 км', id: 3 },
  { title: '5 км', id: 4 },
  { title: '10 км', id: 5 },
];