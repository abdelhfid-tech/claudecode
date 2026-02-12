/* ============================================================ */
/* PROC SQL SAS : Jointure entre 3 tables A, B et C             */
/* ============================================================ */

/* --- INNER JOIN entre A, B et C --- */
proc sql;
    create table resultat_inner as
    select
        a.id    as a_id,
        a.nom   as a_nom,
        b.id    as b_id,
        b.label as b_label,
        c.id    as c_id,
        c.valeur as c_valeur
    from work.table_a as a
    inner join work.table_b as b on b.a_id = a.id
    inner join work.table_c as c on c.b_id = b.id;
quit;

/* --- LEFT JOIN : conserve toutes les lignes de A --- */
proc sql;
    create table resultat_left as
    select
        a.id    as a_id,
        a.nom   as a_nom,
        b.id    as b_id,
        b.label as b_label,
        c.id    as c_id,
        c.valeur as c_valeur
    from work.table_a as a
    left join work.table_b as b on b.a_id = a.id
    left join work.table_c as c on c.b_id = b.id;
quit;

/* --- Jointure mixte : INNER A-B, LEFT (A-B)-C --- */
proc sql;
    create table resultat_mixte as
    select
        a.id    as a_id,
        a.nom   as a_nom,
        b.id    as b_id,
        b.label as b_label,
        c.id    as c_id,
        c.valeur as c_valeur
    from work.table_a as a
    inner join work.table_b as b on b.a_id = a.id
    left  join work.table_c as c on c.b_id = b.id;
quit;

/* --- RIGHT JOIN : conserve toutes les lignes de C --- */
proc sql;
    create table resultat_right as
    select
        a.id    as a_id,
        a.nom   as a_nom,
        b.id    as b_id,
        b.label as b_label,
        c.id    as c_id,
        c.valeur as c_valeur
    from work.table_a as a
    right join work.table_b as b on b.a_id = a.id
    right join work.table_c as c on c.b_id = b.id;
quit;

/* --- RIGHT JOIN mixte : INNER A-B, RIGHT (A-B)-C --- */
proc sql;
    create table resultat_right_mixte as
    select
        a.id    as a_id,
        a.nom   as a_nom,
        b.id    as b_id,
        b.label as b_label,
        c.id    as c_id,
        c.valeur as c_valeur
    from work.table_a as a
    inner join work.table_b as b on b.a_id = a.id
    right join work.table_c as c on c.b_id = b.id;
quit;
