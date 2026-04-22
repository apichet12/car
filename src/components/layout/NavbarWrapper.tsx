'use client'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'

interface NavbarWrapperProps {
  user?: { name: string; role: string } | null
}

export default function NavbarWrapper({ user }: NavbarWrapperProps) {
  return <Navbar user={user} />
}
