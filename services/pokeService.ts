import pokemons from '@/db/pokemons.json';


export const pokeService = (client: any) => {
	return {
		getAllAsync: async (params: { search?: string }) => {
			const { search } = params;

			const filteredPokemons = search ? pokemons.filter(pokemon =>
				pokemon.name.toLowerCase().includes(search.toLowerCase()) || pokemon.number.toLowerCase().includes(search.toLowerCase()),
			) : pokemons;

			const response = async () => new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						message: 'Dados retornados com sucesso',
						success: true,
						data: filteredPokemons,
					});
				}, 1000); // Simulando um delay de 1 segundo
			});

			return response();
		},
	};
};