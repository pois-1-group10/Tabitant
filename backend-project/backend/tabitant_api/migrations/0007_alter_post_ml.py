# Generated by Django 5.0.4 on 2024-05-18 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabitant_api', '0006_alter_goodcomment_comment_badcomment_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='hiragana_1',
            field=models.CharField(default='', max_length=15),
        ),
        migrations.AddField(
            model_name='post',
            name='hiragana_2',
            field=models.CharField(default='', max_length=15),
        ),
        migrations.AddField(
            model_name='post',
            name='hiragana_3',
            field=models.CharField(default='', max_length=15),
        ),
        migrations.AddField(
            model_name='post',
            name='hiragana_4',
            field=models.CharField(default='', max_length=15),
        ),
        migrations.AddField(
            model_name='post',
            name='hiragana_5',
            field=models.CharField(default='', max_length=15),
        ),
    ]
