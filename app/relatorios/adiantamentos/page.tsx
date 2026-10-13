'use client'

import AppLayout from "@/components/layout/AppLayout";
import AdiantamentosSection from "@/components/sections/AdiantamentosSection";
import { useState } from "react";

export default function Adiantamentos(){
    const [dataLimite, setDataLimite] = useState<string>('')
    const [empresa, setEmpresa] = useState<string>('')

    return(
        <AppLayout>
            <AdiantamentosSection/>
        </AppLayout>
    )
}