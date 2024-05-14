# Generated by Django 5.0.4 on 2024-05-14 05:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabitant_api', '0002_prefecture_comment_goodcomment_post_good_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='%Y/%m%d/', verbose_name='アイコン'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='default_post',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tabitant_api.post'),
        ),
    ]
