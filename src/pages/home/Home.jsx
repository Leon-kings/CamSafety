import React from 'react'
import { Hero } from '../../components/hero/Hero'
import { About } from '../about/About'
import { Services } from '../services/Services'
import { PricingPlan } from '../pricing/PricePlan'
import { Offer } from '../offer/Offers'
import { Team } from '../team/Team'
import { Testimonials } from '../testimony/Testimony'
import { Blogs } from '../../components/blogs/Blogs'
import { Contact } from '../contact/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <PricingPlan />
      <Offer />
      <Team />
      <Testimonials />
      <Blogs />
      <Contact />
    </>
  )
}
