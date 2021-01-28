import React from 'react';
import { DatePicker } from 'antd';
const RangePickerAntd = DatePicker.RangePicker;

export default function RangePicker(props: React.PropsWithChildren<{
    onChange: (data: any) => void;
}>) {
    return (
        <RangePickerAntd
            className="round w-100"
            onChange={props.onChange}
            locale={{
                "lang": {
                    "locale": "es_MX",
                    "placeholder": "Selecciona una fecha",
                    "rangePlaceholder": [ "Inicio", "Fin" ],
                    "today": "Hoy",
                    "now": "Ahora",
                    "backToToday": "Hoy",
                    "ok": "Ok",
                    "clear": "Limpiar",
                    "month": "Mes",
                    "year": "Año",
                    "timeSelect": "Selecciona una hora",
                    "dateSelect": "Selecciona una fecha",
                    "monthSelect": "Selecciona un mes",
                    "yearSelect": "Selecciona un año",
                    "decadeSelect": "Selecciona una decada",
                    "yearFormat": "YYYY",
                    "dateFormat": "D/M/YYYY",
                    "dayFormat": "D",
                    "dateTimeFormat": "D/M/YYYY HH:mm:ss",
                    "monthFormat": "MMMM",
                    "monthBeforeYear": true,
                    "previousMonth": "Mes anterior (Re Pág)",
                    "nextMonth": "Siguiente mes (Av Pág)",
                    "previousYear": "Año pasado (Control + left)",
                    "nextYear": "Año siguiente (Control + right)",
                    "previousDecade": "Decada pasada",
                    "nextDecade": "Dacada siguiente",
                    "previousCentury": "Siglo pasado",
                    "nextCentury": "Sigo siguiente"
                },
                "timePickerLocale": {
                    "placeholder": "Selecciona una hora"
                },
                "dateFormat": "YYYY-MM-DD",
                "dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
                "weekFormat": "YYYY-wo",
                "monthFormat": "YYYY-MM"
            }}
        />
    );
}