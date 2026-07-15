package com.cafe.cafeapi.repository;

import com.cafe.cafeapi.model.Order;
import com.cafe.cafeapi.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByClientIdOrderByDateCommandeDesc(Long clientId);
    List<Order> findAllByOrderByDateCommandeDesc();
    List<Order> findByStatutNotOrderByDateCommandeDesc(OrderStatus statut);
    List<Order> findByDateCommandeBetween(LocalDateTime start, LocalDateTime end);
}
