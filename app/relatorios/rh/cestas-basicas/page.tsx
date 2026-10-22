'use client'

import AppLayout from "@/components/layout/AppLayout";
import CestasBasicasSection from "@/components/sections/CestasBasicasSection";
import { useState } from "react";

export default function CestasBasicasPage(){
    const [dataLimite, setDataLimite] = useState<string>('')
    const [empresa, setEmpresa] = useState<string>('')

    return(
        <AppLayout>
            <CestasBasicasSection/>
        </AppLayout>
    )
}