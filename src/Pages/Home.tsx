import { useQuery } from "@tanstack/react-query"


const URL= "https://pokeapi.co/api/v2/location/"

const fetchLocations = async () => {
    const response = await fetch(URL)
    const data = await response.json()
    return data
}

export default function Home() {
    const query = useQuery({queryKey: ['locations'], queryFn: fetchLocations})

    return(
        <>
        {query.isPending ? "Loading..." : <Countries countries={query.data!} />}
        </>
    )
}