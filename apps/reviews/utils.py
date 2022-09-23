def formatearFecha(fecha: str) -> str:
    if fecha == None:
        return ''
    return fecha.strftime('%d/%m/%Y')