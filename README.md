

# PRScalc
Calculation polygenic risk for individual 23andme mutation reports using PGS catalog. Live at https://episphere.github.io/prs !

# About info
 The PRS calculator relies solely on published/validated/open-source risk scores from the PGS catalog, whereas consumer genomics companies use proprietary algorithms that cannot be readily reproduced by others. Additionally, we observed that the inherent reusability of this design led to the use of the PRS calculator as a research tool to compare different PGS catalog entries, by reviewing the in-browser SNPedia and dbSNP analysis.
 
# Scope/Limitations 
This calculator was devised as an implementation proof of concept. It has a number of important limitations for epidemiology research and it does not meet criteria for clinical use. The current tool uses pre-imputation genotype data and thus results in a low number of SNP matches. Most important, only the relative risk model (Box 1, eq 2) is calculated, with no effort to determine absolute risk of disease. Finally, the risk calculation will only be attempted for PGS catalog entries reporting effects as beta values under "effect_weight".

# 23andme files
The participants in the Personal Genome Project (PGP) have volunteered to share their DNA sequences, medical information, and other personal information with the research community and the general public.

https://my.pgp-hms.org/public_genetic_data?data_type=23andMe

female sample (dorothy): https://my.pgp-hms.org/profile/hu54EEB2
male sample (chad):  https://my.pgp-hms.org/profile/huDA1243

