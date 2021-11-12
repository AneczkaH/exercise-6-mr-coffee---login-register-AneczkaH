CREATE DATABASE mrcoffee_express;


CREATE user mrcoffee_user WITH ENCRYPTED PASSWORD 'mrCoffee';
GRANT ALL PRIVILEGES ON DATABASE mrcoffee_express TO mrcoffee_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mrcoffee_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mrcoffee_user;



CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);
CREATE TABLE schedules (
    schedule_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    day  SMALLINT NOT NULL CHECK (day > 0 AND day < 8),
    start_at TIME NOT NULL,
    end_at TIME NOT NULL,
    PRIMARY KEY(schedule_id),
    CONSTRAINT fk_users
    FOREIGN KEY(user_id) 
      REFERENCES users(user_id)
);


INSERT INTO
  users (firstname, lastname, email, password)
  VALUES 
    ('James', 'Bond', 'james.bond@gmail.com', 'b6b7fb4cad4bc020f76e16889a8e9065cb708d0f8c304a8a3db609b644da9536')
    ('Tony', 'Stark', 'starkrulz@gmail.com', 'a836ebba36776b21dd0f5cdca497bff65c5bdfc8411cfbfe0111f27bde1c1894')
    ('Ali', 'G', 'nameisnotborat@gmail.com', '3b5fe14857124335bb8832cc602f8edcfa12db42be36b135bef5bca47e3f2b9c');

INSERT INTO
  schedules (user_id, day, start_at, end_at)
  VALUES 
 ('1', '1', '14:00', '16:00'),
  ('1', '2', '14:00', '16:00'),
  ('1', '3', '14:00', '16:00'),
  ('3', '5', '8:00', '18:00');

SELECT * FROM schedules
	JOIN users ON schedules.user_id = users.user_id;