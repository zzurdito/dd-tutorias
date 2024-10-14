package com.app_tutorias.model;

import jakarta.persistence.*;

@Entity
@Table(name="usuarios")
public class Usuario{
	
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private long id;
	
	@Column(name="nombre");
	private String nombre;
	
	@Column(name="apellido");
	private String apellido;
	
	@Column(name="email");
	private String email;

}