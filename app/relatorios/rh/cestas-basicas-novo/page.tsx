'use client'

import AppLayout from "@/components/layout/AppLayout";
import CestasBasicasNovoSection from "@/components/sections/CestasBasicasNovoSection";
import CestasBasicasSection from "@/components/sections/CestasBasicasSection";
import { useState } from "react";

export default function CestasBasicasNovoPage(){
    const [dataLimite, setDataLimite] = useState<string>('')
    const [empresa, setEmpresa] = useState<string>('')

    return(
        <AppLayout>
            <CestasBasicasNovoSection/>
        </AppLayout>
    )
}