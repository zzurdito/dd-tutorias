package com.app_tutorias.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.app_tutorias.Repository.UsuarioRepository;
import com.app_tutorias.exception.ResourceNotFoundException;
import com.app_tutorias.model.Usuario;

@RestController
@RequestMapping("/api/v1")
public class UsuarioController {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@GetMapping("/usuarios")
	public List<Usuario> listUsuarios(){
		return usuarioRepository.findAll();
	}
	
	@GetMapping("/usuarios")
	public Usuario guardarUsuario(@RequestBody Usuario usuario) {
		return usuarioRepository.save(usuario);
	}
	
	@GetMapping("/usuarios")
	public ResponseEntity<Usuario> listUsuarioPorId(@PathVariable Long id, @RequestBody Usuario usuarioRequest){
		Usuario usuario = usuarioRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("El usuario con ese ID no existe : " + id));
		
		usuario.setNombre(usuarioRequest.getNombre());
		usuario.setApellido(usuarioRequest.getApellido());
		usuario.setEmail(usuarioRequest.getEmail());
		
		Usuario usuarioActualizado = usuarioRepository.save(usuario);		
		return ResponseEntity.ok(usuarioActualizado);
	}
	
	@DeleteMapping("/usuario/{id}")
	public ResponseEntity<Map<String, Boolean>>  eliminarUsuario(@PathVariable Long id){
		Usuario usuario = usuarioRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("El usuario con ese ID no existe : " + id));
		
		usuarioRepository.delete(usuario);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}
	
}
