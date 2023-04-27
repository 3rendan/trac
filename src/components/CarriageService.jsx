import React from 'react'
import { Link } from 'react-router-dom'

const CarriageService = () => {
  return (
    <div className='container'>
      <Link to='/form'><button className='btn'>Signup for Carriage Reports</button></Link>
      <div className="text-center">
        <h1 className='faq-title-row'>Carriage Service</h1>
        <p className='fs-6'>A national airdate tracking website sourced by TRAC-Media</p>
      </div>
      <div className="faq-toc">
        <ul className='faq-links'>
          <li><a href="#what_is_it">What is carriage?</a></li>
          <li><a href="#what_data">What data is available on the carriage website?</a></li>
          <li><a href="#what_is_included">What do the carriage website reports include?</a></li>
          <li><a href="#who_has_access">Who can use this service?</a></li>
          <li><a href="#multiple">May I track more than one program?</a></li>
          <li><a href="#purchase">May I purchase one simple report of past airings?</a></li>
          <li><a href="#contact">Who do I contact to inquire about this service?</a></li>
        </ul>
      </div>
      <div className="faq-answers">
        <h4 id='what_is_it'>What is carriage?</h4>
        APT carriage service is a separate fee-based service enabling producers to track their program's scheduled air dates on more than 340 public stations located across the country. The data is made available through our carriage website - developed in conjunction with TRAC-Media, our preferred supplier of carriage data for APT programs.

        <h4 id='what_data'>What data is available on the carriage website?</h4>
        This website offers direct access to carriage data in an easy-to-read format, 24 hours a day, seven days a week. It also provides a wealth of research options to help compile and analyze data for your programs. Those who use this service find it provides information which is incredibly valuable both to demonstrate market penetration to current sponsors and to assist in demonstrating success so important in securing future underwriting.

        <h4 id='what_is_included'>What do the carriage website reports include?</h4>
        <p>The website allows you to find out how many stations are airing your show and the percentage of the country these stations cover in terms of households. This information is a great tool that helps producers with their underwriting, station relations and marketing efforts. Included is:</p>
        <ul>
          <li>A detailed schedule information with advance data (3-4 weeks ahead of broadcast)</li>
          <li>Timeslot Reports: listing by timeslots</li>
          <li>Station Schedules: schedules for all public television stations</li>
          <li>Carriage Summaries: summary of number of airings, stations, coverage, day-part, audience demographics (with pie and graph charts)</li>
          <li>Station Cumes: cumulative reports based on markets in which the program has aired, and audience demographics</li>
          <li>Station Changes: station drops and adds for a particular program</li>
          <li>Station Lists: an up-to-date list of all Public Television Stations, Nielsen DMA's, Metered Markets and Flagship Stations.</li>
        </ul>

        <h4 id='who_has_access'>Who can use this service?</h4>
        Producers may purchase access through APT and must be affiliated with the program they wish to track. We do not share your title’s tracking information with other producers. We have negotiated special rates with TRAC-Media for our clients specifically.

        <h4 id='multiple'>May I track more than one program?</h4>
        Yes. Please note that cost is separate per title and is based on number of episodes. The titles you wish to track <span className="fw-bolder">must be in current distribution by APT.</span>

        <h4 id='purchase'>May I purchase one simple report of past airings?</h4>
        Yes. In addition, we also provide pricing for a one-time report of past airdates. Cost is based on date-range of data requested. Please contact us for a price quote.

        <h4 id='contact'>Who do I contact to inquire about this service?</h4>
        Please call or email <a href='mailto:olivia_wong@aptonline.org'>Olivia Wong</a> at 617-338-4455, x. 129.

        <p className='fw-bolder fst-italic'>Please Note: The program you are interested in tracking through our service must be currently distributed by APT.</p>
      </div>
      <Link to='/form'><button className='btn'>Signup for Carriage Reports</button></Link>
    </div>
  )
}

export default CarriageService
