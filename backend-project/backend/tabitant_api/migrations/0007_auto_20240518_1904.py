# Generated by Django 5.0.4 on 2024-05-18 10:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tabitant_api', '0006_alter_goodcomment_comment_badcomment_and_more'),
    ]

    sql = """
        CREATE VIEW IF NOT EXISTS tabitant_api_user_emotion_view AS 
        SELECT ROW_NUMBER() OVER() AS id,
               user.id AS user_id,
               AVG(post.emotion_ureshii) AS emotion_ureshii,
               AVG(post.emotion_omoshiroi) AS emotion_omoshiroi,
               AVG(post.emotion_samishii) AS emotion_samishii,
               AVG(post.emotion_shimijimi) AS emotion_shimijimi,
               AVG(post.emotion_odayaka) AS emotion_odayaka,
               AVG(post.emotion_ikari) AS emotion_ikari,
               SQRT(POW(emotion_ureshii, 2) + POW(emotion_omoshiroi, 2) + POW(emotion_samishii, 2) + 
               POW(emotion_shimijimi, 2) + POW(emotion_odayaka, 2) + POW(emotion_ikari, 2)) AS norm2
        FROM tabitant_api_user AS user
        LEFT OUTER JOIN tabitant_api_post AS post
        ON user.id = post.user_id
        GROUP BY user.id;
    """

    reverse_sql = """
        DROP VIEW IF EXISTS tabitant_api_user_emotion_view;
    """

    operations = [
        migrations.RunSQL(sql, reverse_sql)
    ]
