'use client'

import React, { useState } from "react"
import Link from "next/link"
import { RiFileList3Line } from "react-icons/ri"
import Button from "../ui/Button"
import { HiPlus } from "react-icons/hi";
import { useModalStore } from "@/stores/modalStore"


const Navbar = () => {

  const {openCreateAgreementModal} = useModalStore()

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <RiFileList3Line className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema AFAP</h1>
              <p className="text-sm text-gray-500">Controle de Mensalidades e Acordos</p>
            </div>
          </div>
          <div className=" text-gray-900">
            <nav className="-mb-px flex space-x-8">
              <Link className="border-b border-gray-200" href="/">Mensalidades</Link>
              <Link className="border-b border-gray-200" href="/acordos">Acordos</Link>
            </nav>
          </div>
          <Button
            texto="Novo Acordo"
            icone={<HiPlus />}
            onClick={openCreateAgreementModal}
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar;