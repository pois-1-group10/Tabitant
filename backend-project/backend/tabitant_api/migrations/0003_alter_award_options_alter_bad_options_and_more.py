# Generated by Django 5.0.4 on 2024-05-15 11:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabitant_api', '0002_alter_user_email'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='award',
            options={'verbose_name': '受賞', 'verbose_name_plural': '受賞'},
        ),
        migrations.AlterModelOptions(
            name='bad',
            options={'verbose_name': 'Bad', 'verbose_name_plural': 'Bad'},
        ),
        migrations.AlterModelOptions(
            name='comment',
            options={'verbose_name': 'コメント', 'verbose_name_plural': 'コメント'},
        ),
        migrations.AlterModelOptions(
            name='competition',
            options={'verbose_name': '大会', 'verbose_name_plural': '大会'},
        ),
        migrations.AlterModelOptions(
            name='follow',
            options={'verbose_name': 'フォロー', 'verbose_name_plural': 'フォロー'},
        ),
        migrations.AlterModelOptions(
            name='good',
            options={'verbose_name': 'Good', 'verbose_name_plural': 'Good'},
        ),
        migrations.AlterModelOptions(
            name='goodcomment',
            options={'verbose_name': 'コメントへの Good', 'verbose_name_plural': 'コメントへの Good'},
        ),
        migrations.AlterModelOptions(
            name='post',
            options={'verbose_name': '投稿', 'verbose_name_plural': '投稿'},
        ),
        migrations.AlterModelOptions(
            name='prefecture',
            options={'verbose_name': '都道府県', 'verbose_name_plural': '都道府県'},
        ),
        migrations.AlterModelOptions(
            name='tag',
            options={'verbose_name': 'タグ', 'verbose_name_plural': 'タグ'},
        ),
        migrations.AlterModelOptions(
            name='userprofile',
            options={'verbose_name': 'ユーザープロフィール', 'verbose_name_plural': 'ユーザープロフィール'},
        ),
        migrations.AlterUniqueTogether(
            name='follow',
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name='bad',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bads', to='tabitant_api.post'),
        ),
        migrations.AlterField(
            model_name='bad',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bads', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='good',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='goods', to='tabitant_api.post'),
        ),
        migrations.AddConstraint(
            model_name='bad',
            constraint=models.UniqueConstraint(fields=('user', 'post'), name='bad_unique'),
        ),
        migrations.AddConstraint(
            model_name='follow',
            constraint=models.UniqueConstraint(fields=('follower', 'followee'), name='follow_unique'),
        ),
        migrations.AddConstraint(
            model_name='good',
            constraint=models.UniqueConstraint(fields=('user', 'post'), name='good_unique'),
        ),
        migrations.AddConstraint(
            model_name='goodcomment',
            constraint=models.UniqueConstraint(fields=('user', 'comment'), name='goodcomment_unique'),
        ),
    ]