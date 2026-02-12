-- ============================================================
-- Procédure SQL : Jointure entre 3 tables A, B et C
-- ============================================================

CREATE OR REPLACE PROCEDURE sp_jointure_trois_tables()
LANGUAGE SQL
AS $$
    SELECT
        a.id    AS a_id,
        a.nom   AS a_nom,
        b.id    AS b_id,
        b.label AS b_label,
        c.id    AS c_id,
        c.valeur AS c_valeur
    FROM table_a AS a
    INNER JOIN table_b AS b ON b.a_id = a.id
    INNER JOIN table_c AS c ON c.b_id = b.id;
$$;

-- ============================================================
-- Variantes utiles
-- ============================================================

-- LEFT JOIN : conserve toutes les lignes de A même sans correspondance
CREATE OR REPLACE PROCEDURE sp_jointure_left()
LANGUAGE SQL
AS $$
    SELECT
        a.id    AS a_id,
        a.nom   AS a_nom,
        b.id    AS b_id,
        b.label AS b_label,
        c.id    AS c_id,
        c.valeur AS c_valeur
    FROM table_a AS a
    LEFT JOIN table_b AS b ON b.a_id = a.id
    LEFT JOIN table_c AS c ON c.b_id = b.id;
$$;

-- Jointure mixte : INNER entre A-B, LEFT entre (A-B)-C
CREATE OR REPLACE PROCEDURE sp_jointure_mixte()
LANGUAGE SQL
AS $$
    SELECT
        a.id    AS a_id,
        a.nom   AS a_nom,
        b.id    AS b_id,
        b.label AS b_label,
        c.id    AS c_id,
        c.valeur AS c_valeur
    FROM table_a AS a
    INNER JOIN table_b AS b ON b.a_id = a.id
    LEFT  JOIN table_c AS c ON c.b_id = b.id;
$$;
