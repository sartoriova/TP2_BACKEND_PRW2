create table veterinario(

	id serial,
	nome varchar(40) not null,
	crmv varchar(8) not null,
	data_nascimento date,
	logradouro varchar(40),
	numero int ,
	bairro varchar(40),
	cep varchar(9),
	cidade varchar(40),
	uf char(2),
	telefone varchar(15),
	email varchar(40),

	constraint pk_veterinario primary key(id),
	constraint uq_crmv_vet unique(crmv)
);


create table tutor(

	id serial,
	nome varchar(40) not null,
	cpf varchar(15) not null,
	data_nascimento date,
	logradouro varchar(40),
	numero int ,
	bairro varchar(40),
	cep varchar(9),
	cidade varchar(40),
	uf char(2),
	telefone varchar(15),
	email varchar(40),

	constraint pk_tutor primary key(id),
	constraint uq_cpf_tutor unique(cpf)
);


create table pet(

	id serial,
	nome varchar(40),
	data_nascimento date not null,
	especie varchar(40) not null,
	raca varchar(40),
	id_tutor int,
	
	constraint pk_pet primary key(id),
	constraint fk_tutor_pet foreign key(id_tutor) references tutor(id)
	
);


create table consulta(

	id serial,
	id_vet int not null,
	id_pet int not null,
	data_hora timestamp not null,
	valor real,
	

	constraint pk_consulta primary key(id),
	constraint fk_consulta_vet foreign key(id_vet) references veterinario(id),
	constraint fk_consulta_pet foreign key(id_pet) references pet(id)
);