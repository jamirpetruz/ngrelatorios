'use client'

import AppLayout from "@/components/layout/AppLayout";
import CentroDeCustoSection from "@/components/sections/CentroDeCusto";
import { useState } from "react";

export default function Adiantamentos(){
    const [dataLimite, setDataLimite] = useState<string>('')
    const [empresa, setEmpresa] = useState<string>('')

    return(
        <AppLayout>
            <CentroDeCustoSection/>
        </AppLayout>
    )
}