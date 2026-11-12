CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/snrm2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/snrm2: snrm2.c $(HDRS) | $(BIN)
	$(CC) snrm2.c -o $(BIN)/snrm2 -lcublas

clean:
	rm -rf $(BIN)
