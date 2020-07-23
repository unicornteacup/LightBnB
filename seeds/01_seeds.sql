INSERT INTO users (id, name, email, password)
VALUES
(1, 'Johnny Bravo','johnny74@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Herbert Bombles','ilikerabbits@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Lucy Poodleface','poodlesarefun@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(4, 'Janine Navarro','goodafternoon@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
(1, 1, 'Big Fancy House', 'description', 'https:// image1.jpeg', 'https:// image1.jpeg', 4000, 3, 4, 6, 'England', 'Park Lane', 'London', 'Greater London', 'W1 2pa', 'true'),
(2, 3, 'Tiny House', 'description', 'https:// image1.jpeg', 'https:// image1.jpeg', 150, 1, 1, 1, 'Canada', 'Woodland Road', 'Tofino', 'BC', 'V4P 9W3', 'true'),
(3, 4, 'The Villa', 'description', 'https:// image1.jpeg', 'https:// image1.jpeg', 600, 2, 2, 4, 'Spain', 'Via Romano', 'Seville', 'Andalusia', '41092', 'true'),
(4, 2, 'Chateau Picard', 'description', 'https:// image1.jpeg', 'https:// image1.jpeg', 10000, 6, 8, 12, 'France', 'Rue St Bernard', 'Vezelay', 'Bourgogne', '89510', 'true');


INSERT INTO reservations (id, guest_id, property_id, start_date, end_date) 
VALUES (1, 1, 3, '2018-09-11', '2018-09-26'),
(2, 2, 1, '2019-01-04', '2019-02-01'),
(3, 3, 2, '2019-01-04', '2019-02-01'),
(4, 4, 4, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES
(1, 2, 1, 2, 5, 'reviewtext'),
(2, 1, 3, 1, 3, 'reviewtext'),
(3, 3, 2, 3, 4, 'reviewtext'),
(4, 4, 4, 4, 1, 'reviewtext'); 