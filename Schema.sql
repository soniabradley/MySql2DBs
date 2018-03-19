DROP DATABASE IF EXISTS topSongs_DB;
CREATE database topSongs_DB;

CREATE TABLE top1000 (
  position INT NOT NULL,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  year INT NULL,
  --   (10,4) numbers on left,right side of decimal point
  raw_total DECIMAL(10,4) NULL,
  raw_usa DECIMAL(10,4) NULL,
  raw_uk DECIMAL(10,4) NULL,
  raw_eur DECIMAL(10,4) NULL,
  raw_row DECIMAL(10,4) NULL,
  PRIMARY KEY (position)
);

USE topSongs_DB;
-- go to SequelPro, FILE, Import, then select file to open then import
SELECT * FROM top1000;
select * from top_albums;

CREATE TABLE top_albums (
  position INT NOT NULL,
  artist VARCHAR(100) NULL,
  album VARCHAR(100) NULL,
  year INT NULL,
  raw_total DECIMAL(10,4) NULL,
  raw_usa DECIMAL(10,4) NULL,
  raw_uk DECIMAL(10,4) NULL,
  raw_eur DECIMAL(10,4) NULL,
  raw_row DECIMAL(10,4) NULL,
  PRIMARY KEY (position)
);

-- these queries must be written in certain order, do the research
-- * means everything
SELECT artist, COUNT(*) FROM top1000 
GROUP BY artist
HAVING COUNT(*) > 1;
-- in descending order
ORDER BY COUNT (*) DESC;
-- a query that searches for the top 

